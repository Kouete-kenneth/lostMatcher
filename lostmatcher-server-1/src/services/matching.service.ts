import {
	ImageMatchingService,
	ImageFeatures,
	ComparisonResult,
} from "./imageMatching.service";
import {
	TextMatchingService,
	TextComparisonResult,
} from "./textMatching.service";
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
	text_similarity?: number; // Add text similarity score
	confidence: number;
	matches_count: number;
	document: any;
}

export interface MatchingResults {
	imageMatches: MatchCandidate[];
	textMatches: MatchCandidate[];
	combinedMatches: MatchCandidate[];
	summary: {
		imageMatchCount: number;
		textMatchCount: number;
		combinedMatchCount: number;
		hasImageFeatures: boolean;
		hasTextDescription: boolean;
	};
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
	 * Returns three independent result sets: image-only, text-only, and combined
	 */
	static async findMatchesForLostReport(
		lostReportId: string
	): Promise<MatchingResults> {
		try {
			const lostReport = await LostReport.findById(lostReportId).populate(
				"reporter"
			);
			if (!lostReport) {
				throw new Error("Lost report not found");
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

			const hasImageFeatures = !!lostReport.image?.descriptors;
			const hasTextDescription = !!lostReport.itemDetails?.description;

			// Step 1: Get image-based matches (if image features exist)
			let imageMatchesMap: Map<string, MatchCandidate> = new Map();
			if (hasImageFeatures) {
				imageMatchesMap = await this.getImageMatchesForLostReport(
					lostReport,
					userThreshold
				);
				logging.info(
					`Found ${imageMatchesMap.size} image-based matches`
				);
			}

			// Step 2: Get text-based matches (if description exists)
			let textMatchesMap: Map<string, MatchCandidate> = new Map();
			if (hasTextDescription) {
				textMatchesMap = await this.getTextMatchesForLostReport(
					lostReport,
					userThreshold
				);
				logging.info(`Found ${textMatchesMap.size} text-based matches`);
			}

			// Step 3: Fuse results intelligently for combined matches
			const combinedMatchesArray = this.fuseMatchResults(
				imageMatchesMap,
				textMatchesMap
			);

			// Convert to arrays and sort each set independently
			const imageMatches = Array.from(imageMatchesMap.values()).sort(
				(a, b) => b.similarity_score - a.similarity_score
			);

			const textMatches = Array.from(textMatchesMap.values()).sort(
				(a, b) => b.similarity_score - a.similarity_score
			);

			const combinedMatches = combinedMatchesArray.sort(
				(a, b) => b.similarity_score - a.similarity_score
			);

			const results: MatchingResults = {
				imageMatches,
				textMatches,
				combinedMatches,
				summary: {
					imageMatchCount: imageMatches.length,
					textMatchCount: textMatches.length,
					combinedMatchCount: combinedMatches.length,
					hasImageFeatures,
					hasTextDescription,
				},
			};

			logging.info(
				`Matching results for lost report ${lostReportId}: Image(${results.summary.imageMatchCount}), Text(${results.summary.textMatchCount}), Combined(${results.summary.combinedMatchCount})`
			);

			// Save the top three COMBINED matches to the Match collection (for compatibility)
			if (combinedMatches.length > 0) {
				try {
					const topMatches = combinedMatches
						.slice(0, 3)
						.map((match) => ({
							foundReportId: match.id,
							matchScore: match.similarity_score,
						}));

					await MatchCRUDService.saveTopMatches(
						lostReportId,
						topMatches
					);
					logging.info(
						`Saved top ${topMatches.length} combined matches for lost report ${lostReportId}`
					);

					// Send notifications for the top combined matches
					try {
						await MatchNotificationService.sendMatchNotifications({
							user: lostReport.reporter as any,
							lostReportId: lostReportId,
							matches: combinedMatches.slice(0, 3),
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

			return results;
		} catch (error: unknown) {
			logging.error("Failed to find matches for lost report:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to find matches: ${errorMessage}`);
		}
	}

	/**
	 * Find potential matches for a found report by comparing with lost reports and items
	 * Returns three independent result sets: image-only, text-only, and combined
	 */
	static async findMatchesForFoundReport(
		foundReportId: string
	): Promise<MatchingResults> {
		try {
			const foundReport = await FoundReport.findById(
				foundReportId
			).populate("finder");
			if (!foundReport) {
				throw new Error("Found report not found");
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

			const hasImageFeatures = !!foundReport.image?.descriptors;
			const hasTextDescription = !!foundReport.itemDetails?.description;

			// Step 1: Get image-based matches (if image features exist)
			let imageMatchesMap: Map<string, MatchCandidate> = new Map();
			if (hasImageFeatures) {
				imageMatchesMap = await this.getImageMatchesForFoundReport(
					foundReport,
					userThreshold
				);
				logging.info(
					`Found ${imageMatchesMap.size} image-based matches`
				);
			}

			// Step 2: Get text-based matches (if description exists)
			let textMatchesMap: Map<string, MatchCandidate> = new Map();
			if (hasTextDescription) {
				textMatchesMap = await this.getTextMatchesForFoundReport(
					foundReport,
					userThreshold
				);
				logging.info(`Found ${textMatchesMap.size} text-based matches`);
			}

			// Step 3: Fuse results intelligently for combined matches
			const combinedMatchesArray = this.fuseMatchResults(
				imageMatchesMap,
				textMatchesMap
			);

			// Convert to arrays and sort each set independently
			const imageMatches = Array.from(imageMatchesMap.values()).sort(
				(a, b) => b.similarity_score - a.similarity_score
			);

			const textMatches = Array.from(textMatchesMap.values()).sort(
				(a, b) => b.similarity_score - a.similarity_score
			);

			const combinedMatches = combinedMatchesArray.sort(
				(a, b) => b.similarity_score - a.similarity_score
			);

			const results: MatchingResults = {
				imageMatches,
				textMatches,
				combinedMatches,
				summary: {
					imageMatchCount: imageMatches.length,
					textMatchCount: textMatches.length,
					combinedMatchCount: combinedMatches.length,
					hasImageFeatures,
					hasTextDescription,
				},
			};

			logging.info(
				`Matching results for found report ${foundReportId}: Image(${results.summary.imageMatchCount}), Text(${results.summary.textMatchCount}), Combined(${results.summary.combinedMatchCount})`
			);

			// Save the top three matches to the Match collection
			if (combinedMatches.length > 0) {
				try {
					// For found reports, we only care about matches with lost reports (not items)
					const lostMatches = combinedMatches
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

			return results;
		} catch (error: unknown) {
			logging.error("Failed to find matches for found report:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to find matches: ${errorMessage}`);
		}
	}

	/**
	 * Find potential text-based matches for a found report by comparing with lost reports and items
	 */
	static async findTextMatchesForFoundReport(
		foundReportId: string
	): Promise<MatchCandidate[]> {
		try {
			const foundReport = await FoundReport.findById(
				foundReportId
			).populate("finder");
			if (!foundReport) {
				throw new Error("Found report not found");
			}

			// Get user's custom matching threshold
			const finderId =
				(foundReport.finder as any)._id || foundReport.finder;
			const userThreshold = await this.getUserMatchingThreshold(
				finderId.toString()
			);
			logging.info(
				`Using text matching threshold ${userThreshold} for found report ${foundReportId}`
			);

			const foundDescription = foundReport.itemDetails?.description || "";
			const foundName = foundReport.itemDetails?.name || "";
			const foundCategory = foundReport.itemDetails?.category || "";

			const matches: MatchCandidate[] = [];

			// Compare with lost reports
			const lostReports = await LostReport.find({
				status: { $ne: "resolved" },
			})
				.select(
					"_id itemDetails.name itemDetails.description itemDetails.category lostDate lostLocation image.url reporter"
				)
				.populate("reporter", "name _id");

			for (const lostReport of lostReports) {
				const lostDescription =
					lostReport.itemDetails?.description || "";
				const lostName = lostReport.itemDetails?.name || "";
				const lostCategory = lostReport.itemDetails?.category || "";

				// Skip if no text to compare
				if (
					(!foundDescription && !foundName) ||
					(!lostDescription && !lostName)
				) {
					continue;
				}

				// Use text-based matching only
				const textComparison = await TextMatchingService.compareTexts(
					foundDescription,
					lostDescription
				);

				// Convert the similarity to a score between 0 and 1
				const similarityScore = textComparison.similarity;

				if (similarityScore >= userThreshold) {
					// Create a clean document with only essential information
					const cleanDocument = {
						_id: lostReport._id,
						itemDetails: {
							name:
								lostReport.itemDetails?.name || "Unknown Item",
							description:
								lostReport.itemDetails?.description || "",
							category:
								lostReport.itemDetails?.category ||
								"Uncategorized",
						},
						lostDate: lostReport.lostDate,
						lostLocation:
							lostReport.lostLocation || "Unknown location",
						image: {
							url: lostReport.image?.url || "",
						},
						reporter: lostReport.reporter
							? {
									name:
										(lostReport.reporter as any).name ||
										"Anonymous",
									_id: (lostReport.reporter as any)._id,
							  }
							: {
									name: "Anonymous",
									_id: "unknown",
							  },
					};

					matches.push({
						id: (lostReport._id as any).toString(),
						type: "lost",
						similarity_score: similarityScore,
						text_similarity: similarityScore, // Same as overall for text-only
						confidence: 0.5, // Default confidence for text matching
						matches_count: 1, // Not applicable for text matching
						document: cleanDocument,
					});
				}
			}

			// Sort by similarity score (highest first)
			matches.sort((a, b) => b.similarity_score - a.similarity_score);

			return matches;
		} catch (error: unknown) {
			logging.error(
				"Failed to find text matches for found report:",
				error
			);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to find text matches: ${errorMessage}`);
		}
	}

	/**
	 * Find potential combined matches for a found report with higher weight on combined metrics
	 */
	static async findCombinedMatchesForFoundReport(
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
				`Using combined matching threshold ${userThreshold} for found report ${foundReportId}`
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

			const foundDescription = foundReport.itemDetails?.description || "";
			const foundName = foundReport.itemDetails?.name || "";
			const foundCategory = foundReport.itemDetails?.category || "";

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

				const lostDescription =
					lostReport.itemDetails?.description || "";
				const lostName = lostReport.itemDetails?.name || "";
				const lostCategory = lostReport.itemDetails?.category || "";

				// Image comparison
				const imageComparison =
					await ImageMatchingService.compareFeatures(
						foundFeatures,
						lostFeatures
					);

				// Text comparison if descriptions are available
				let textSimilarity = 0;
				if (foundDescription && lostDescription) {
					const textComparison =
						await TextMatchingService.compareTexts(
							foundDescription,
							lostDescription
						);
					textSimilarity = textComparison.similarity;
				}

				// Combine scores with weights
				// For combined matching, weight text more heavily
				const imageWeight = 0.6; // Lower for combined search
				const textWeight = 0.4; // Higher for combined search

				let combinedScore =
					imageWeight * imageComparison.similarity_score +
					textWeight * textSimilarity;

				// Enhance with name and category matching
				if (
					foundName &&
					lostName &&
					foundName.toLowerCase() === lostName.toLowerCase()
				) {
					combinedScore = Math.min(1.0, combinedScore + 0.1);
				}

				if (
					foundCategory &&
					lostCategory &&
					foundCategory.toLowerCase() === lostCategory.toLowerCase()
				) {
					combinedScore = Math.min(1.0, combinedScore + 0.05);
				}

				if (combinedScore >= userThreshold) {
					matches.push({
						id: (lostReport._id as any).toString(),
						type: "lost",
						similarity_score: combinedScore,
						text_similarity: textSimilarity,
						confidence: imageComparison.confidence,
						matches_count: imageComparison.matches_count,
						document: lostReport,
					});
				}
			}

			// Sort by similarity score (highest first)
			matches.sort((a, b) => b.similarity_score - a.similarity_score);

			return matches;
		} catch (error: unknown) {
			logging.error(
				"Failed to find combined matches for found report:",
				error
			);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to find combined matches: ${errorMessage}`);
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
	 * Combine image and text matching for comprehensive comparison
	 */
	static async combineImageAndTextMatching(
		imageFeatures1: ImageFeatures,
		imageFeatures2: ImageFeatures,
		description1: string,
		description2: string,
		userThreshold: number = this.DEFAULT_SIMILARITY_THRESHOLD
	): Promise<MatchCandidate> {
		try {
			// Get image comparison
			const imageComparison = await ImageMatchingService.compareFeatures(
				imageFeatures1,
				imageFeatures2
			);

			// Get text comparison (use 70% threshold for text)
			const textComparison = await TextMatchingService.compareTexts(
				description1,
				description2,
				0.7
			);

			// Combine scores - weighted average (70% image, 30% text)
			const combinedScore =
				imageComparison.similarity_score * 0.7 +
				textComparison.similarity * 0.3;

			// Enhanced confidence based on both modalities
			const enhancedConfidence = Math.min(
				imageComparison.confidence + (textComparison.isMatch ? 0.2 : 0),
				1.0
			);

			logging.info(
				`Combined matching - Image: ${imageComparison.similarity_score.toFixed(
					3
				)}, Text: ${textComparison.similarity.toFixed(
					3
				)}, Combined: ${combinedScore.toFixed(3)}`
			);

			return {
				id: "",
				type: "found",
				similarity_score: combinedScore,
				text_similarity: textComparison.similarity,
				confidence: enhancedConfidence,
				matches_count: imageComparison.matches_count,
				document: null,
			};
		} catch (error) {
			logging.error("Error in combined matching:", error);
			// Fallback to image-only matching
			const imageComparison = await ImageMatchingService.compareFeatures(
				imageFeatures1,
				imageFeatures2
			);
			return {
				id: "",
				type: "found",
				similarity_score: imageComparison.similarity_score,
				text_similarity: 0,
				confidence: imageComparison.confidence,
				matches_count: imageComparison.matches_count,
				document: null,
			};
		}
	}

	/**
	 * Get image-based matches for a lost report
	 */
	private static async getImageMatchesForLostReport(
		lostReport: any,
		userThreshold: number
	): Promise<Map<string, MatchCandidate>> {
		const imageMatches = new Map<string, MatchCandidate>();

		const lostFeatures: ImageFeatures = {
			descriptors: lostReport.image.descriptors,
			descriptors_shape: lostReport.image.descriptors_shape || [0, 128],
			keypoints_count: lostReport.image.keypoints_count || 0,
			keypoints: lostReport.image.keypoints || [],
			image_shape: lostReport.image.image_shape || [0, 0],
		};

		// Get found reports with image features
		const foundReports = await FoundReport.find({
			status: { $ne: "resolved" },
			"image.descriptors": { $exists: true },
		})
			.select(
				"_id itemDetails.name itemDetails.description itemDetails.category foundDate foundLocation image.url image.descriptors image.descriptors_shape image.keypoints_count image.keypoints image.image_shape finder"
			)
			.populate("finder", "name _id");

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

			const imageComparison = await ImageMatchingService.compareFeatures(
				lostFeatures,
				foundFeatures
			);

			if (imageComparison.similarity_score >= userThreshold) {
				const cleanDocument = {
					_id: foundReport._id,
					itemDetails: {
						name: foundReport.itemDetails?.name || "Unknown Item",
						description: foundReport.itemDetails?.description || "",
						category:
							foundReport.itemDetails?.category ||
							"Uncategorized",
					},
					foundDate: foundReport.foundDate,
					foundLocation:
						foundReport.foundLocation || "Unknown location",
					image: {
						url: foundReport.image?.url || "",
					},
					finder: foundReport.finder
						? {
								name:
									(foundReport.finder as any).name ||
									"Anonymous",
								_id: (foundReport.finder as any)._id,
						  }
						: {
								name: "Anonymous",
								_id: "unknown",
						  },
				};

				imageMatches.set((foundReport._id as any).toString(), {
					id: (foundReport._id as any).toString(),
					type: "found",
					similarity_score: imageComparison.similarity_score,
					text_similarity: 0, // No text matching in this phase
					confidence: imageComparison.confidence,
					matches_count: imageComparison.matches_count,
					document: cleanDocument,
				});
			}
		}

		return imageMatches;
	}

	/**
	 * Get text-based matches for a lost report
	 */
	private static async getTextMatchesForLostReport(
		lostReport: any,
		userThreshold: number
	): Promise<Map<string, MatchCandidate>> {
		const textMatches = new Map<string, MatchCandidate>();

		const lostDescription = lostReport.itemDetails?.description || "";

		// Get found reports with descriptions
		const foundReports = await FoundReport.find({
			status: { $ne: "resolved" },
			"itemDetails.description": { $exists: true, $ne: "" },
		})
			.select(
				"_id itemDetails.name itemDetails.description itemDetails.category foundDate foundLocation image.url finder"
			)
			.populate("finder", "name _id");

		for (const foundReport of foundReports) {
			const foundDescription = foundReport.itemDetails?.description || "";

			if (!foundDescription) continue;

			const textComparison = await TextMatchingService.compareTexts(
				lostDescription,
				foundDescription
			);

			if (textComparison.similarity >= userThreshold) {
				const cleanDocument = {
					_id: foundReport._id,
					itemDetails: {
						name: foundReport.itemDetails?.name || "Unknown Item",
						description: foundReport.itemDetails?.description || "",
						category:
							foundReport.itemDetails?.category ||
							"Uncategorized",
					},
					foundDate: foundReport.foundDate,
					foundLocation:
						foundReport.foundLocation || "Unknown location",
					image: {
						url: foundReport.image?.url || "",
					},
					finder: foundReport.finder
						? {
								name:
									(foundReport.finder as any).name ||
									"Anonymous",
								_id: (foundReport.finder as any)._id,
						  }
						: {
								name: "Anonymous",
								_id: "unknown",
						  },
				};

				textMatches.set((foundReport._id as any).toString(), {
					id: (foundReport._id as any).toString(),
					type: "found",
					similarity_score: textComparison.similarity,
					text_similarity: textComparison.similarity,
					confidence: 0.5, // Default confidence for text matching
					matches_count: 1, // Not applicable for text matching
					document: cleanDocument,
				});
			}
		}

		return textMatches;
	}

	/**
	 * Fuse image and text matching results intelligently to avoid duplicates
	 */
	private static fuseMatchResults(
		imageMatches: Map<string, MatchCandidate>,
		textMatches: Map<string, MatchCandidate>
	): MatchCandidate[] {
		const fusedResults = new Map<string, MatchCandidate>();

		// Add all image matches first
		for (const [id, match] of imageMatches) {
			fusedResults.set(id, match);
		}

		// Process text matches
		for (const [id, textMatch] of textMatches) {
			if (fusedResults.has(id)) {
				// Item found in both image and text matching - fuse the scores
				const imageMatch = fusedResults.get(id)!;

				// Combined score using weighted average
				// Give more weight to image matching (70%) and text matching (30%)
				const combinedScore =
					imageMatch.similarity_score * 0.7 +
					textMatch.similarity_score * 0.3;

				// Enhanced confidence when both modalities agree
				const enhancedConfidence = Math.min(
					imageMatch.confidence + 0.2, // Boost confidence when both match
					1.0
				);

				fusedResults.set(id, {
					...imageMatch,
					similarity_score: combinedScore,
					text_similarity: textMatch.similarity_score,
					confidence: enhancedConfidence,
				});

				logging.info(
					`Fused match for item ${id}: Image(${imageMatch.similarity_score.toFixed(
						3
					)}) + Text(${textMatch.similarity_score.toFixed(
						3
					)}) = Combined(${combinedScore.toFixed(3)})`
				);
			} else {
				// Text-only match
				fusedResults.set(id, textMatch);
			}
		}

		// Convert map to array
		return Array.from(fusedResults.values());
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

	/**
	 * Get image-based matches for a found report against lost reports and items
	 */
	private static async getImageMatchesForFoundReport(
		foundReport: any,
		userThreshold: number
	): Promise<Map<string, MatchCandidate>> {
		const imageMatches = new Map<string, MatchCandidate>();

		const foundFeatures: ImageFeatures = {
			descriptors: foundReport.image.descriptors,
			descriptors_shape: foundReport.image.descriptors_shape || [0, 128],
			keypoints_count: foundReport.image.keypoints_count || 0,
			keypoints: foundReport.image.keypoints || [],
			image_shape: foundReport.image.image_shape || [0, 0],
		};

		// Compare with lost reports
		const lostReports = await LostReport.find({
			status: { $ne: "resolved" },
			"image.descriptors": { $exists: true },
		})
			.select(
				"_id itemDetails.name itemDetails.description itemDetails.category lostDate lostLocation image.url image.descriptors image.descriptors_shape image.keypoints_count image.keypoints image.image_shape reporter"
			)
			.populate("reporter", "name _id");

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

			const imageComparison = await ImageMatchingService.compareFeatures(
				foundFeatures,
				lostFeatures
			);

			if (imageComparison.similarity_score >= userThreshold) {
				const cleanDocument = {
					_id: lostReport._id,
					itemDetails: {
						name: lostReport.itemDetails?.name || "Unknown Item",
						description: lostReport.itemDetails?.description || "",
						category:
							lostReport.itemDetails?.category || "Uncategorized",
					},
					lostDate: lostReport.lostDate,
					lostLocation: lostReport.lostLocation || "Unknown location",
					image: {
						url: lostReport.image?.url || "",
					},
					reporter: lostReport.reporter
						? {
								name:
									(lostReport.reporter as any).name ||
									"Anonymous",
								_id: (lostReport.reporter as any)._id,
						  }
						: {
								name: "Anonymous",
								_id: "unknown",
						  },
				};

				imageMatches.set((lostReport._id as any).toString(), {
					id: (lostReport._id as any).toString(),
					type: "lost",
					similarity_score: imageComparison.similarity_score,
					text_similarity: 0, // No text matching in this phase
					confidence: imageComparison.confidence,
					matches_count: imageComparison.matches_count,
					document: cleanDocument,
				});
			}
		}

		// Compare with registered items
		const items = await itemsModel
			.find({
				"image.descriptors": { $exists: true },
			})
			.select(
				"_id itemDetails.name itemDetails.description itemDetails.category image.url image.descriptors image.descriptors_shape image.keypoints_count image.keypoints image.image_shape owner"
			)
			.populate("owner", "name _id");

		for (const item of items) {
			if (!item.image?.descriptors) continue;

			const itemFeatures: ImageFeatures = {
				descriptors: item.image.descriptors,
				descriptors_shape: item.image.descriptors_shape || [0, 128],
				keypoints_count: item.image.keypoints_count || 0,
				keypoints: item.image.keypoints || [],
				image_shape: item.image.image_shape || [0, 0],
			};

			const imageComparison = await ImageMatchingService.compareFeatures(
				foundFeatures,
				itemFeatures
			);

			if (imageComparison.similarity_score >= userThreshold) {
				const cleanDocument = {
					_id: item._id,
					itemDetails: {
						name: item.itemDetails?.name || "Unknown Item",
						description: item.itemDetails?.description || "",
						category: item.itemDetails?.category || "Uncategorized",
					},
					image: {
						url: item.image?.url || "",
					},
					owner: item.owner
						? {
								name: (item.owner as any).name || "Anonymous",
								_id: (item.owner as any)._id,
						  }
						: {
								name: "Anonymous",
								_id: "unknown",
						  },
				};

				imageMatches.set((item._id as any).toString(), {
					id: (item._id as any).toString(),
					type: "item",
					similarity_score: imageComparison.similarity_score,
					text_similarity: 0, // No text matching in this phase
					confidence: imageComparison.confidence,
					matches_count: imageComparison.matches_count,
					document: cleanDocument,
				});
			}
		}

		return imageMatches;
	}

	/**
	 * Get text-based matches for a found report against lost reports and items
	 */
	private static async getTextMatchesForFoundReport(
		foundReport: any,
		userThreshold: number
	): Promise<Map<string, MatchCandidate>> {
		const textMatches = new Map<string, MatchCandidate>();

		const foundDescription = foundReport.itemDetails?.description || "";

		// Compare with lost reports
		const lostReports = await LostReport.find({
			status: { $ne: "resolved" },
			"itemDetails.description": { $exists: true, $ne: "" },
		})
			.select(
				"_id itemDetails.name itemDetails.description itemDetails.category lostDate lostLocation image.url reporter"
			)
			.populate("reporter", "name _id");

		for (const lostReport of lostReports) {
			const lostDescription = lostReport.itemDetails?.description || "";

			if (!lostDescription) continue;

			const textComparison = await TextMatchingService.compareTexts(
				foundDescription,
				lostDescription
			);

			if (textComparison.similarity >= userThreshold) {
				const cleanDocument = {
					_id: lostReport._id,
					itemDetails: {
						name: lostReport.itemDetails?.name || "Unknown Item",
						description: lostReport.itemDetails?.description || "",
						category:
							lostReport.itemDetails?.category || "Uncategorized",
					},
					lostDate: lostReport.lostDate,
					lostLocation: lostReport.lostLocation || "Unknown location",
					image: {
						url: lostReport.image?.url || "",
					},
					reporter: lostReport.reporter
						? {
								name:
									(lostReport.reporter as any).name ||
									"Anonymous",
								_id: (lostReport.reporter as any)._id,
						  }
						: {
								name: "Anonymous",
								_id: "unknown",
						  },
				};

				textMatches.set((lostReport._id as any).toString(), {
					id: (lostReport._id as any).toString(),
					type: "lost",
					similarity_score: textComparison.similarity,
					text_similarity: textComparison.similarity,
					confidence: 0.5, // Default confidence for text matching
					matches_count: 1, // Not applicable for text matching
					document: cleanDocument,
				});
			}
		}

		// Compare with registered items (if they have descriptions)
		const items = await itemsModel
			.find({
				"itemDetails.description": { $exists: true, $ne: "" },
			})
			.select(
				"_id itemDetails.name itemDetails.description itemDetails.category image.url owner"
			)
			.populate("owner", "name _id");

		for (const item of items) {
			const itemDescription = item.itemDetails?.description || "";

			if (!itemDescription) continue;

			const textComparison = await TextMatchingService.compareTexts(
				foundDescription,
				itemDescription
			);

			if (textComparison.similarity >= userThreshold) {
				const cleanDocument = {
					_id: item._id,
					itemDetails: {
						name: item.itemDetails?.name || "Unknown Item",
						description: item.itemDetails?.description || "",
						category: item.itemDetails?.category || "Uncategorized",
					},
					image: {
						url: item.image?.url || "",
					},
					owner: item.owner
						? {
								name: (item.owner as any).name || "Anonymous",
								_id: (item.owner as any)._id,
						  }
						: {
								name: "Anonymous",
								_id: "unknown",
						  },
				};

				textMatches.set((item._id as any).toString(), {
					id: (item._id as any).toString(),
					type: "item",
					similarity_score: textComparison.similarity,
					text_similarity: textComparison.similarity,
					confidence: 0.5, // Default confidence for text matching
					matches_count: 1, // Not applicable for text matching
					document: cleanDocument,
				});
			}
		}

		return textMatches;
	}
}
