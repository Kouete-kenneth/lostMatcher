import { Router } from "express";
import { MatchingController } from "../controllers/manualMatching.controller";

const router = Router();

/**
 * @route POST /api/manual-matching/lost-report/:lostReportId
 * @desc Manually trigger matching for a lost report
 * @access Public (adjust based on your auth requirements)
 */
router.post(
	"/lost-report/:lostReportId",
	MatchingController.triggerMatchingForLostReport
);

/**
 * @route POST /api/manual-matching/found-report/:foundReportId
 * @desc Manually trigger matching for a found report
 * @access Public (adjust based on your auth requirements)
 */
router.post(
	"/found-report/:foundReportId",
	MatchingController.triggerMatchingForFoundReport
);

export default router;
