import {
	ImageMatchingService,
	ImageFeatures,
	ComparisonResult,
} from "./imageMatching.service";
import { LostReport } from "../models/lostReport.model";
import { FoundReport } from "../models/foundReport.model";
import itemsModel from "../models/items.model";
import logging from "../config/logging.config";
import { MatchCRUDService } from "./matchCRUD.service";
import User from "../models/user.model";
import { MatchNotificationService } from "./matchNotification.service";

export interface MatchCandidate {
	id: string;
	type: "lost" | "found" | "item";
	similarity_score: number;
	confidence: number;
	matches_count: number;
	document: any;
}

export class MatchingService {
	private static readonly DEFAULT_SIMILARITY_THRESHOLD = 0.15; // 15% - fallback threshold
	private static readonly CONFIDENCE_THRESHOLD = 0.3; // Adjust based on testing

	/**
	 * Get user's custom matching threshold or use default
	 */
	private static async getUserMatchingThreshold(
		userId: string
	): Promise<number> {
		try {
			const user = await User.findById(userId);
			if (user && user.matchingThreshold) {
				// Convert user's threshold (0-100) to 0-1 scale
				return user.matchingThreshold / 100;
			}
			return this.DEFAULT_SIMILARITY_THRESHOLD;
		} catch (error) {
			logging.error("Failed to get user matching threshold:", error);
			return this.DEFAULT_SIMILARITY_THRESHOLD;
		}
	}

	/**
	 * Find potential matches for a lost report by comparing with found reports only
	 */
	static async findMatchesForLostReport(
		lostReportId: string
	): Promise<MatchCandidate[]> {
		try {
			const lostReport = await LostReport.findById(lostReportId).populate(
				"reporter"
			);
			if (!lostReport || !lostReport.image.descriptors) {
				throw new Error(
					"Lost report not found or has no image features"
				);
			}

			// Get user's custom matching threshold
			const reporterId =
				(lostReport.reporter as any)._id || lostReport.reporter;
			const userThreshold = await this.getUserMatchingThreshold(
				reporterId.toString()
			);

			logging.info(
				`Using matching threshold ${
					userThreshold * 100
				}% for user ${reporterId}`
			);

			const lostFeatures: ImageFeatures = {
				descriptors: lostReport.image.descriptors,
				descriptors_shape: lostReport.image.descriptors_shape || [
					0, 128,
				],
				keypoints_count: lostReport.image.keypoints_count || 0,
				keypoints: lostReport.image.keypoints || [],
				image_shape: lostReport.image.image_shape || [0, 0],
			};

			const matches: MatchCandidate[] = [];

			// Compare with found reports only
			const foundReports = await FoundReport.find({
				status: { $ne: "resolved" },
				"image.descriptors": { $exists: true },
			});

			for (const foundReport of foundReports) {
				const foundFeatures: ImageFeatures = {
					descriptors: foundReport.image.descriptors!,
					descriptors_shape: foundReport.image.descriptors_shape || [
						0, 128,
					],
					keypoints_count: foundReport.image.keypoints_count || 0,
					keypoints: foundReport.image.keypoints || [],
					image_shape: foundReport.image.image_shape || [0, 0],
				};

				const comparison = await ImageMatchingService.compareFeatures(
					lostFeatures,
					foundFeatures
				);

				if (comparison.similarity_score >= userThreshold) {
					matches.push({
						id: (foundReport._id as any).toString(),
						type: "found",
						similarity_score: comparison.similarity_score,
						confidence: comparison.confidence,
						matches_count: comparison.matches_count,
						document: foundReport,
					});
				}
			}

			// Sort by similarity score (highest first)
			matches.sort((a, b) => b.similarity_score - a.similarity_score);

			logging.info(
				`Found ${matches.length} potential matches for lost report ${lostReportId}`
			);

			// Save the top three matches to the Match collection
			if (matches.length > 0) {
				try {
					const topMatches = matches.slice(0, 3).map((match) => ({
						foundReportId: match.id,
						matchScore: match.similarity_score,
					}));

					await MatchCRUDService.saveTopMatches(
						lostReportId,
						topMatches
					);
					logging.info(
						`Saved top ${topMatches.length} matches for lost report ${lostReportId}`
					);

					// Send notifications for the matches
					try {
						await MatchNotificationService.sendMatchNotifications({
							user: lostReport.reporter as any,
							lostReportId: lostReportId,
							matches: matches.slice(0, 3), // Send notifications for top 3 matches
							reportType: "lost",
						});
						logging.info(
							`Match notifications sent for lost report ${lostReportId}`
						);
					} catch (notificationError) {
						logging.error(
							"Failed to send match notifications:",
							notificationError
						);
						// Continue execution even if notifications fail
					}
				} catch (error) {
					logging.error("Failed to save matches to database:", error);
					// Continue execution even if saving matches fails
				}
			}

			return matches;
		} catch (error: unknown) {
			logging.error("Failed to find matches for lost report:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to find matches: ${errorMessage}`);
		}
	}

	/**
	 * Find potential matches for a found report by comparing with lost reports and items
	 */
	static async findMatchesForFoundReport(
		foundReportId: string
	): Promise<MatchCandidate[]> {
		try {
			const foundReport = await FoundReport.findById(
				foundReportId
			).populate("finder");
			if (!foundReport || !foundReport.image.descriptors) {
				throw new Error(
					"Found report not found or has no image features"
				);
			}

			// Get user's custom matching threshold
			const finderId =
				(foundReport.finder as any)._id || foundReport.finder;
			const userThreshold = await this.getUserMatchingThreshold(
				finderId.toString()
			);
			logging.info(
				`Using matching threshold ${userThreshold} for found report ${foundReportId}`
			);

			const foundFeatures: ImageFeatures = {
				descriptors: foundReport.image.descriptors,
				descriptors_shape: foundReport.image.descriptors_shape || [
					0, 128,
				],
				keypoints_count: foundReport.image.keypoints_count || 0,
				keypoints: foundReport.image.keypoints || [],
				image_shape: foundReport.image.image_shape || [0, 0],
			};

			const matches: MatchCandidate[] = [];

			// Compare with lost reports
			const lostReports = await LostReport.find({
				status: { $ne: "resolved" },
				"image.descriptors": { $exists: true },
			});

			for (const lostReport of lostReports) {
				const lostFeatures: ImageFeatures = {
					descriptors: lostReport.image.descriptors!,
					descriptors_shape: lostReport.image.descriptors_shape || [
						0, 128,
					],
					keypoints_count: lostReport.image.keypoints_count || 0,
					keypoints: lostReport.image.keypoints || [],
					image_shape: lostReport.image.image_shape || [0, 0],
				};

				const comparison = await ImageMatchingService.compareFeatures(
					foundFeatures,
					lostFeatures
				);

				if (comparison.similarity_score >= userThreshold) {
					matches.push({
						id: (lostReport._id as any).toString(),
						type: "lost",
						similarity_score: comparison.similarity_score,
						confidence: comparison.confidence,
						matches_count: comparison.matches_count,
						document: lostReport,
					});
				}
			}

			// Compare with registered items
			const items = await itemsModel.find({
				"image.descriptors": { $exists: true },
			});

			for (const item of items) {
				if (!item.image?.descriptors) continue;

				const itemFeatures: ImageFeatures = {
					descriptors: item.image.descriptors,
					descriptors_shape: item.image.descriptors_shape || [0, 128],
					keypoints_count: item.image.keypoints_count || 0,
					keypoints: item.image.keypoints || [],
					image_shape: item.image.image_shape || [0, 0],
				};

				const comparison = await ImageMatchingService.compareFeatures(
					foundFeatures,
					itemFeatures
				);

				if (comparison.similarity_score >= userThreshold) {
					matches.push({
						id: (item._id as any).toString(),
						type: "item",
						similarity_score: comparison.similarity_score,
						confidence: comparison.confidence,
						matches_count: comparison.matches_count,
						document: item,
					});
				}
			}

			// Sort by similarity score (highest first)
			matches.sort((a, b) => b.similarity_score - a.similarity_score);

			logging.info(
				`Found ${matches.length} potential matches for found report ${foundReportId}`
			);

			// Save the top three matches to the Match collection
			if (matches.length > 0) {
				try {
					// For found reports, we only care about matches with lost reports (not items)
					const lostMatches = matches
						.filter((match) => match.type === "lost")
						.slice(0, 3);

					if (lostMatches.length > 0) {
						const topMatches = lostMatches.map((match) => ({
							foundReportId: foundReportId,
							matchScore: match.similarity_score,
						}));

						// Note: We might need to create a separate collection for found->lost matches
						// For now, logging this information
						logging.info(
							`Found ${lostMatches.length} lost report matches for found report ${foundReportId}`
						);

						// Send notifications for the matches
						try {
							await MatchNotificationService.sendMatchNotifications(
								{
									user: foundReport.finder as any,
									lostReportId: foundReportId,
									matches: lostMatches,
									reportType: "found",
								}
							);
							logging.info(
								`Match notifications sent for found report ${foundReportId}`
							);
						} catch (notificationError) {
							logging.error(
								"Failed to send match notifications:",
								notificationError
							);
							// Continue execution even if notifications fail
						}
					}
				} catch (error) {
					logging.error("Failed to process matches:", error);
					// Continue execution even if processing matches fails
				}
			}

			return matches;
		} catch (error: unknown) {
			logging.error("Failed to find matches for found report:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to find matches: ${errorMessage}`);
		}
	}

	/**
	 * Compare two images directly by their features
	 */
	static async compareImageFeatures(
		features1: ImageFeatures,
		features2: ImageFeatures
	): Promise<ComparisonResult> {
		return ImageMatchingService.compareFeatures(features1, features2);
	}

	/**
	 * Get high-confidence matches only
	 */
	static getHighConfidenceMatches(
		matches: MatchCandidate[]
	): MatchCandidate[] {
		return matches.filter(
			(match) => match.confidence >= this.CONFIDENCE_THRESHOLD
		);
	}
}
