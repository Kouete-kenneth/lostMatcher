import Match, { IMatch } from "../models/match.model";
import mongoose from "mongoose";
import logging from "../config/logging.config";

export class MatchCRUDService {
	/**
	 * Save the top three matches for a lost report
	 */
	static async saveTopMatches(
		lostReportId: string,
		matches: Array<{
			foundReportId: string;
			matchScore: number;
		}>
	): Promise<IMatch[]> {
		try {
			// Take only the top 3 matches
			const topThreeMatches = matches.slice(0, 3);

			logging.info(
				`Saving ${topThreeMatches.length} matches for lost report ${lostReportId}`
			);

			// First, delete any existing matches for this lost report
			await Match.deleteMany({
				lostReportId: new mongoose.Types.ObjectId(lostReportId),
			});

			// Create new match documents
			const matchDocs = topThreeMatches.map((match) => ({
				lostReportId: new mongoose.Types.ObjectId(lostReportId),
				foundReportId: new mongoose.Types.ObjectId(match.foundReportId),
				matchScore: match.matchScore,
				status: "pending_claim" as const,
			}));

			// Insert the new matches
			const savedMatches = await Match.insertMany(matchDocs);

			logging.info(
				`Successfully saved ${savedMatches.length} matches for lost report ${lostReportId}`
			);
			return savedMatches;
		} catch (error) {
			logging.error("Error saving top matches:", error);
			throw error;
		}
	}

	/**
	 * Get matches for a lost report
	 */
	static async getMatchesForLostReport(
		lostReportId: string
	): Promise<IMatch[]> {
		try {
			const matches = await Match.find({
				lostReportId: new mongoose.Types.ObjectId(lostReportId),
			})
				.populate("foundReportId")
				.sort({ matchScore: -1 });

			return matches;
		} catch (error) {
			logging.error("Error getting matches for lost report:", error);
			throw error;
		}
	}

	/**
	 * Update match status
	 */
	static async updateMatchStatus(
		matchId: string,
		status: "pending_claim" | "claim_approved" | "under_approval"
	): Promise<IMatch | null> {
		try {
			const updatedMatch = await Match.findByIdAndUpdate(
				matchId,
				{ status },
				{ new: true }
			).populate("foundReportId");

			if (!updatedMatch) {
				throw new Error(`Match with ID ${matchId} not found`);
			}

			logging.info(`Updated match ${matchId} status to ${status}`);
			return updatedMatch;
		} catch (error) {
			logging.error("Error updating match status:", error);
			throw error;
		}
	}

	/**
	 * Get matches by status
	 */
	static async getMatchesByStatus(
		status: "pending_claim" | "claim_approved" | "under_approval"
	): Promise<IMatch[]> {
		try {
			const matches = await Match.find({ status })
				.populate("lostReportId")
				.populate("foundReportId")
				.sort({ createdAt: -1 });

			return matches;
		} catch (error) {
			logging.error("Error getting matches by status:", error);
			throw error;
		}
	}

	/**
	 * Get a specific match by ID
	 */
	static async getMatchById(matchId: string): Promise<IMatch | null> {
		try {
			const match = await Match.findById(matchId)
				.populate("lostReportId")
				.populate("foundReportId");

			return match;
		} catch (error) {
			logging.error("Error getting match by ID:", error);
			throw error;
		}
	}

	/**
	 * Delete matches for a lost report (e.g., when lost report is deleted)
	 */
	static async deleteMatchesForLostReport(
		lostReportId: string
	): Promise<void> {
		try {
			const result = await Match.deleteMany({
				lostReportId: new mongoose.Types.ObjectId(lostReportId),
			});

			logging.info(
				`Deleted ${result.deletedCount} matches for lost report ${lostReportId}`
			);
		} catch (error) {
			logging.error("Error deleting matches for lost report:", error);
			throw error;
		}
	}

	/**
	 * Delete matches for a found report (e.g., when found report is deleted)
	 */
	static async deleteMatchesForFoundReport(
		foundReportId: string
	): Promise<void> {
		try {
			const result = await Match.deleteMany({
				foundReportId: new mongoose.Types.ObjectId(foundReportId),
			});

			logging.info(
				`Deleted ${result.deletedCount} matches for found report ${foundReportId}`
			);
		} catch (error) {
			logging.error("Error deleting matches for found report:", error);
			throw error;
		}
	}
}
