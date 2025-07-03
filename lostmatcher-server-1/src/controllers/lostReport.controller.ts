import { Request, Response, NextFunction } from "express";
import { LostReportService } from "../services/lostReport.service";
import { MatchCRUDService } from "../services/matchCRUD.service";

interface AuthRequest extends Request {
	user?: { id: string };
}

export const createLostReportController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { itemDetails, attributes, lostDate, lostLocation } = req.body;
		if (!req.user || !req.user.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		const reporter = req.user.id;
		const file = req.file;
		if (!file) {
			res.status(400).json({ message: "Image file is required" });
			return;
		}

		// Parse itemDetails if it's a string (from FormData)
		let parsedItemDetails = itemDetails;
		if (typeof itemDetails === "string") {
			try {
				parsedItemDetails = JSON.parse(itemDetails);
			} catch (e) {
				res.status(400).json({ message: "Invalid itemDetails format" });
				return;
			}
		}

		// Parse attributes if it's a string (from FormData)
		let parsedAttributes = attributes;
		if (typeof attributes === "string") {
			try {
				parsedAttributes = JSON.parse(attributes);
			} catch (e) {
				// attributes is optional, so ignore parse errors
				parsedAttributes = {};
			}
		}

		console.log("Creating lost report with data:", {
			reporter,
			itemDetails: parsedItemDetails,
			lostDate,
			lostLocation,
		});

		const report = await LostReportService.createLostReportWithImage({
			reporter,
			itemDetails: parsedItemDetails,
			attributes: parsedAttributes,
			file,
			lostDate: new Date(lostDate),
			lostLocation,
		});

		console.log("Lost report created successfully:", report._id);

		// Return formatted response with the created report
		res.status(201).json({
			status: "success",
			data: report,
			// Include the ID and other fields needed by the frontend
			lostItemId: (report._id as any).toString(),
			itemName: parsedItemDetails?.name || "Unknown Item",
			description: parsedItemDetails?.description || "",
			category: parsedItemDetails?.category || "",
		});
	} catch (err) {
		console.error("Error creating lost report:", err);
		res.status(500).json({
			status: "error",
			message:
				err instanceof Error
					? err.message
					: "Failed to create lost report",
		});
	}
};

export const getAllLostReportsController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const reports = await LostReportService.getAllLostReports();
		res.json(reports);
	} catch (err) {
		next(err);
	}
};

export const getLostReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const report = await LostReportService.getLostReportById(req.params.id);
		if (!report) {
			res.status(404).json({ message: "Lost report not found" });
			return;
		}
		res.json(report);
	} catch (err) {
		next(err);
	}
};

export const updateLostReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const report = await LostReportService.updateLostReportById(
			req.params.id,
			req.body
		);
		if (!report) {
			res.status(404).json({ message: "Lost report not found" });
			return;
		}
		res.json(report);
	} catch (err) {
		next(err);
	}
};

export const deleteLostReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const reportId = req.params.id;

		// Delete associated matches first
		await MatchCRUDService.deleteMatchesForLostReport(reportId);

		const report = await LostReportService.deleteLostReportById(reportId);
		if (!report) {
			res.status(404).json({ message: "Lost report not found" });
			return;
		}
		res.json({ message: "Lost report and associated matches deleted" });
	} catch (err) {
		next(err);
	}
};
