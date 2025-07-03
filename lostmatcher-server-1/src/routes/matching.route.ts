import express from "express";
import type { RequestHandler } from "express";
import {
	findMatchesForLostReportController,
	findMatchesForFoundReportController,
} from "../controllers/matching.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();

// Route to find matches for a lost report - original path
router.get(
	"/lost-report/:id/matches",
	auth(),
	findMatchesForLostReportController as RequestHandler
);

// Route to find matches for a found report - original path
router.get(
	"/found-report/:id/matches",
	auth(),
	findMatchesForFoundReportController as RequestHandler
);

// Routes to match frontend API client endpoints
router.get(
	"/lost/:id",
	auth(),
	findMatchesForLostReportController as RequestHandler
);

router.get(
	"/found/:id",
	auth(),
	findMatchesForFoundReportController as RequestHandler
);

export default router;
