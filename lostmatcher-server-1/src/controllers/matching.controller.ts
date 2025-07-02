import { Request, Response, NextFunction } from "express";
import { MatchingService } from "../services/matching.service";

export const findMatchesForLostReportController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const matches = await MatchingService.findMatchesForLostReport(id);
		res.json({
			lostReportId: id,
			matches: matches,
			totalMatches: matches.length,
			highConfidenceMatches:
				MatchingService.getHighConfidenceMatches(matches).length,
		});
	} catch (err) {
		next(err);
	}
};

export const findMatchesForFoundReportController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		const matches = await MatchingService.findMatchesForFoundReport(id);
		res.json({
			foundReportId: id,
			matches: matches,
			totalMatches: matches.length,
			highConfidenceMatches:
				MatchingService.getHighConfidenceMatches(matches).length,
		});
	} catch (err) {
		next(err);
	}
};
