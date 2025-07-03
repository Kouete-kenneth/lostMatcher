import { Request, Response, NextFunction } from "express";
import { FoundReportService } from "../services/foundReport.service";
import { MatchCRUDService } from "../services/matchCRUD.service";
import { MatchingService } from "../services/matching.service";
import { ImageMatchingService } from "../services/imageMatching.service";
import { TextMatchingService } from "../services/textMatching.service";
import logger from "../config/logging.config";

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

		// Create the found report
		const report = await FoundReportService.createFoundReportWithImage({
			finder,
			itemDetails: parsedItemDetails,
			attributes: parsedAttributes,
			file,
			foundDate: new Date(foundDate),
			foundLocation,
		});

		// After creating the report, perform searches
		try {
			logger.info(
				`Performing searches for found report ${(
					report._id as any
				).toString()}`
			);

			// Get all matches using the unified service
			const allMatches = await MatchingService.findMatchesForFoundReport(
				(report._id as any).toString()
			);

			// Extract the three independent result sets
			const imageMatches = allMatches.imageMatches;
			const textMatches = allMatches.textMatches;
			const combinedMatches = allMatches.combinedMatches;

			// Format the matches in a frontend-friendly way
			const formattedImageMatches = imageMatches.map((match) => ({
				id: `image_result_${match.id}`,
				matchingScore: Math.round(match.similarity_score * 100),
				source: "Image Analysis",
				lostItem: match.document,
				foundItem: report,
			}));

			const formattedTextMatches = textMatches.map((match) => ({
				id: `text_result_${match.id}`,
				matchingScore: Math.round(match.similarity_score * 100),
				source: "Text Analysis",
				lostItem: match.document,
				foundItem: report,
			}));

			const formattedCombinedMatches = combinedMatches.map((match) => ({
				id: `combined_result_${match.id}`,
				matchingScore: Math.round(match.similarity_score * 100),
				source: "Combined Analysis",
				lostItem: match.document,
				foundItem: report,
			}));

			// Return the report with search results, formatted for the frontend
			res.status(201).json({
				status: "success",
				data: report,
				foundReportId: (report._id as any).toString(),
				itemName: report.itemDetails?.name || "Found Item",
				description: report.itemDetails?.description || "",
				category: report.itemDetails?.category || "",
				// Three independent result sets (consistent with matching endpoint)
				imageMatches: formattedImageMatches,
				textMatches: formattedTextMatches,
				combinedMatches: formattedCombinedMatches,
				// Summary information
				summary: {
					imageMatchCount: allMatches.summary.imageMatchCount,
					textMatchCount: allMatches.summary.textMatchCount,
					combinedMatchCount: allMatches.summary.combinedMatchCount,
					hasImageFeatures: allMatches.summary.hasImageFeatures,
					hasTextDescription: allMatches.summary.hasTextDescription,
				},
				// Legacy support
				searchResults: {
					text: formattedTextMatches,
					image: formattedImageMatches,
					combined: formattedCombinedMatches,
				},
			});
		} catch (searchErr) {
			logger.error(`Error performing searches: ${searchErr}`);
			// Still return success for the report creation, with empty search results
			res.status(201).json({
				status: "success",
				data: report,
				foundReportId: (report._id as any).toString(),
				itemName: report.itemDetails?.name || "Found Item",
				description: report.itemDetails?.description || "",
				category: report.itemDetails?.category || "",
				// Three independent result sets (empty due to error)
				imageMatches: [],
				textMatches: [],
				combinedMatches: [],
				// Summary information (empty due to error)
				summary: {
					imageMatchCount: 0,
					textMatchCount: 0,
					combinedMatchCount: 0,
					hasImageFeatures: false,
					hasTextDescription: false,
				},
				// Legacy support
				searchResults: {
					text: [],
					image: [],
					combined: [],
				},
			});
		}
	} catch (err) {
		console.error("Error creating found report:", err);
		res.status(500).json({
			status: "error",
			message:
				err instanceof Error
					? err.message
					: "Failed to create found report",
		});
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
