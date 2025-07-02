import { Request, Response } from "express";
import { MatchCRUDService } from "../services/matchCRUD.service";
import logging from "../config/logging.config";

export class MatchController {
	/**
	 * Get matches for a specific lost report
	 */
	static async getMatchesForLostReport(
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

			const matches = await MatchCRUDService.getMatchesForLostReport(
				lostReportId
			);

			res.status(200).json({
				success: true,
				message: "Matches retrieved successfully",
				data: matches,
				total: matches.length,
			});
		} catch (error: any) {
			logging.error("Error getting matches for lost report:", error);
			res.status(500).json({
				success: false,
				message: "Failed to retrieve matches",
				error: error.message,
			});
		}
	}

	/**
	 * Update match status
	 */
	static async updateMatchStatus(req: Request, res: Response): Promise<void> {
		try {
			const { matchId } = req.params;
			const { status } = req.body;

			if (!matchId) {
				res.status(400).json({
					success: false,
					message: "Match ID is required",
				});
				return;
			}

			if (
				!status ||
				!["pending_claim", "claim_approved", "under_approval"].includes(
					status
				)
			) {
				res.status(400).json({
					success: false,
					message:
						"Valid status is required (pending_claim, claim_approved, under_approval)",
				});
				return;
			}

			const updatedMatch = await MatchCRUDService.updateMatchStatus(
				matchId,
				status
			);

			res.status(200).json({
				success: true,
				message: "Match status updated successfully",
				data: updatedMatch,
			});
		} catch (error: any) {
			logging.error("Error updating match status:", error);
			res.status(500).json({
				success: false,
				message: "Failed to update match status",
				error: error.message,
			});
		}
	}

	/**
	 * Get matches by status
	 */
	static async getMatchesByStatus(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { status } = req.params;

			if (
				!status ||
				!["pending_claim", "claim_approved", "under_approval"].includes(
					status
				)
			) {
				res.status(400).json({
					success: false,
					message:
						"Valid status is required (pending_claim, claim_approved, under_approval)",
				});
				return;
			}

			const matches = await MatchCRUDService.getMatchesByStatus(
				status as any
			);

			res.status(200).json({
				success: true,
				message: "Matches retrieved successfully",
				data: matches,
				total: matches.length,
			});
		} catch (error: any) {
			logging.error("Error getting matches by status:", error);
			res.status(500).json({
				success: false,
				message: "Failed to retrieve matches",
				error: error.message,
			});
		}
	}

	/**
	 * Get a specific match by ID
	 */
	static async getMatchById(req: Request, res: Response): Promise<void> {
		try {
			const { matchId } = req.params;

			if (!matchId) {
				res.status(400).json({
					success: false,
					message: "Match ID is required",
				});
				return;
			}

			const match = await MatchCRUDService.getMatchById(matchId);

			if (!match) {
				res.status(404).json({
					success: false,
					message: "Match not found",
				});
				return;
			}

			res.status(200).json({
				success: true,
				message: "Match retrieved successfully",
				data: match,
			});
		} catch (error: any) {
			logging.error("Error getting match by ID:", error);
			res.status(500).json({
				success: false,
				message: "Failed to retrieve match",
				error: error.message,
			});
		}
	}
}
