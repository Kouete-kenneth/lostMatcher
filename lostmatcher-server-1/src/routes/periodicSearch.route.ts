import express from "express";
import {
	getPeriodicSearchStatus,
	updatePeriodicSearchSettings,
	triggerManualPeriodicSearch,
	triggerPeriodicSearchForReport,
	getServiceStats,
} from "../controllers/periodicSearch.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();

// Get user's periodic search status and settings
router.get("/status", auth(), getPeriodicSearchStatus);

// Update user's periodic search settings
router.put("/settings", auth(), updatePeriodicSearchSettings);

// Trigger manual periodic search for the authenticated user
router.post("/trigger", auth(), triggerManualPeriodicSearch);

// Trigger periodic search for a specific report (admin/manual trigger)
router.post(
	"/trigger/:reportType/:reportId",
	auth(),
	triggerPeriodicSearchForReport
);

// Get service statistics (admin endpoint)
router.get("/stats", auth(), getServiceStats);

export default router;
