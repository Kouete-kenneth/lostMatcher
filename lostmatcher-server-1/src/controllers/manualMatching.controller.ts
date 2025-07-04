import { Request, Response } from "express";
import { MatchingService } from "../services/matching.service";
import logging from "../config/logging.config";

export class MatchingController {
	/**
	 * Manually trigger matching for a lost report
	 */
	static async triggerMatchingForLostReport(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { lostReportId } = req.params;

			if (!lostReportId) {
				res.status(400).json({
					success: false,
					message: "Lost report ID is required",
				});
				return;
			}

			const matchingResults =
				await MatchingService.findMatchesForLostReport(lostReportId);

			// Use combined matches for manual matching
			const matches = matchingResults.combinedMatches;

			res.status(200).json({
				success: true,
				message: "Matching completed successfully",
				data: {
					lostReportId,
					matchesFound: matches.length,
					matches: matches.map((match) => ({
						id: match.id,
						type: match.type,
						similarity_score: match.similarity_score,
						confidence: match.confidence,
						matches_count: match.matches_count,
					})),
					// Include summary for additional info
					summary: {
						imageMatchCount:
							matchingResults.summary.imageMatchCount,
						textMatchCount: matchingResults.summary.textMatchCount,
						combinedMatchCount:
							matchingResults.summary.combinedMatchCount,
						hasImageFeatures:
							matchingResults.summary.hasImageFeatures,
						hasTextDescription:
							matchingResults.summary.hasTextDescription,
					},
				},
			});
		} catch (error: any) {
			logging.error("Error triggering matching for lost report:", error);
			res.status(500).json({
				success: false,
				message: "Failed to trigger matching",
				error: error.message,
			});
		}
	}

	/**
	 * Manually trigger matching for a found report
	 */
	static async triggerMatchingForFoundReport(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { foundReportId } = req.params;

			if (!foundReportId) {
				res.status(400).json({
					success: false,
					message: "Found report ID is required",
				});
				return;
			}

			const matchingResults =
				await MatchingService.findMatchesForFoundReport(foundReportId);

			// Use combined matches for manual matching
			const matches = matchingResults.combinedMatches;

			res.status(200).json({
				success: true,
				message: "Matching completed successfully",
				data: {
					foundReportId,
					matchesFound: matches.length,
					matches: matches.map((match) => ({
						id: match.id,
						type: match.type,
						similarity_score: match.similarity_score,
						confidence: match.confidence,
						matches_count: match.matches_count,
					})),
					// Include summary for additional info
					summary: {
						imageMatchCount:
							matchingResults.summary.imageMatchCount,
						textMatchCount: matchingResults.summary.textMatchCount,
						combinedMatchCount:
							matchingResults.summary.combinedMatchCount,
						hasImageFeatures:
							matchingResults.summary.hasImageFeatures,
						hasTextDescription:
							matchingResults.summary.hasTextDescription,
					},
				},
			});
		} catch (error: any) {
			logging.error("Error triggering matching for found report:", error);
			res.status(500).json({
				success: false,
				message: "Failed to trigger matching",
				error: error.message,
			});
		}
	}
}
