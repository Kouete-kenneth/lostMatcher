import { Router } from "express";
import { MatchController } from "../controllers/match.controller";

const router = Router();

/**
 * @route GET /api/match-records/lost-report/:lostReportId
 * @desc Get matches for a specific lost report
 * @access Public (adjust based on your auth requirements)
 */
router.get(
	"/lost-report/:lostReportId",
	MatchController.getMatchesForLostReport
);

/**
 * @route PUT /api/match-records/:matchId/status
 * @desc Update match status
 * @access Public (adjust based on your auth requirements)
 */
router.put("/:matchId/status", MatchController.updateMatchStatus);

/**
 * @route GET /api/match-records/status/:status
 * @desc Get matches by status
 * @access Public (adjust based on your auth requirements)
 */
router.get("/status/:status", MatchController.getMatchesByStatus);

/**
 * @route GET /api/match-records/:matchId
 * @desc Get a specific match by ID
 * @access Public (adjust based on your auth requirements)
 */
router.get("/:matchId", MatchController.getMatchById);

export default router;
