import { Request, Response, NextFunction } from "express";
import { FoundReportService } from "../services/foundReport.service";
import { MatchCRUDService } from "../services/matchCRUD.service";

interface AuthRequest extends Request {
	user?: { id: string };
}

export const createFoundReportController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { itemDetails, attributes, foundDate, foundLocation } = req.body;
		if (!req.user || !req.user.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		const finder = req.user.id;
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

		const report = await FoundReportService.createFoundReportWithImage({
			finder,
			itemDetails: parsedItemDetails,
			attributes: parsedAttributes,
			file,
			foundDate: new Date(foundDate),
			foundLocation,
		});
		res.status(201).json(report);
	} catch (err) {
		next(err);
	}
};

export const getAllFoundReportsController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const reports = await FoundReportService.getAllFoundReports();
		res.json(reports);
	} catch (err) {
		next(err);
	}
};

export const getFoundReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const report = await FoundReportService.getFoundReportById(
			req.params.id
		);
		if (!report) {
			res.status(404).json({ message: "Found report not found" });
			return;
		}
		res.json(report);
	} catch (err) {
		next(err);
	}
};

export const updateFoundReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const report = await FoundReportService.updateFoundReportById(
			req.params.id,
			req.body
		);
		if (!report) {
			res.status(404).json({ message: "Found report not found" });
			return;
		}
		res.json(report);
	} catch (err) {
		next(err);
	}
};

export const deleteFoundReportByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const reportId = req.params.id;

		// Delete associated matches first
		await MatchCRUDService.deleteMatchesForFoundReport(reportId);

		const report = await FoundReportService.deleteFoundReportById(reportId);
		if (!report) {
			res.status(404).json({ message: "Found report not found" });
			return;
		}
		res.json({ message: "Found report and associated matches deleted" });
	} catch (err) {
		next(err);
	}
};
