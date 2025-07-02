import express from "express";
import multer from "multer";
import type { RequestHandler } from "express";
import {
	createLostReportController,
	getAllLostReportsController,
	getLostReportByIdController,
	updateLostReportByIdController,
	deleteLostReportByIdController,
} from "../controllers/lostReport.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();
const upload = multer();

router.post(
	"/",
	auth(),
	upload.single("file"),
	createLostReportController as RequestHandler
);
router.get("/", getAllLostReportsController as RequestHandler);
router.get("/:id", getLostReportByIdController as RequestHandler);
router.put("/:id", auth(), updateLostReportByIdController as RequestHandler);
router.delete("/:id", auth(), deleteLostReportByIdController as RequestHandler);

export default router;
