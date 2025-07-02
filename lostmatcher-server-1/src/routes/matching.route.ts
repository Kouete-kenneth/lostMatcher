import express from "express";
import type { RequestHandler } from "express";
import {
	findMatchesForLostReportController,
	findMatchesForFoundReportController,
} from "../controllers/matching.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();

// Route to find matches for a lost report
router.get(
	"/lost-report/:id/matches",
	auth(),
	findMatchesForLostReportController as RequestHandler
);

// Route to find matches for a found report
router.get(
	"/found-report/:id/matches",
	auth(),
	findMatchesForFoundReportController as RequestHandler
);

export default router;
