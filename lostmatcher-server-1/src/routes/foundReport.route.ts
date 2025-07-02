import express from "express";
import multer from "multer";
import type { RequestHandler } from "express";
import {
	createFoundReportController,
	getAllFoundReportsController,
	getFoundReportByIdController,
	updateFoundReportByIdController,
	deleteFoundReportByIdController,
} from "../controllers/foundReport.controller";
import { auth } from "../middlewares/auth";

const router = express.Router();
const upload = multer();

router.post(
	"/",
	auth(),
	upload.single("file"),
	createFoundReportController as RequestHandler
);
router.get("/", getAllFoundReportsController as RequestHandler);
router.get("/:id", getFoundReportByIdController as RequestHandler);
router.put("/:id", auth(), updateFoundReportByIdController as RequestHandler);
router.delete(
	"/:id",
	auth(),
	deleteFoundReportByIdController as RequestHandler
);

export default router;
