import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MatchingService } from "../services/matching.service";
import { FoundReport } from "../models/foundReport.model";

export const findMatchesForLostReportController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		console.log(`Finding matches for lost report ID: ${id}`);
		console.log(`Request path: ${req.path}, params:`, req.params);

		if (!id) {
			res.status(400).json({
				status: "error",
				message: "Lost report ID is required",
			});
			return;
		}

		// Try to find the lost report first to verify it exists
		const LostReport = mongoose.model("LostReport");
		try {
			const lostReport = await LostReport.findById(id).exec();
			if (!lostReport) {
				console.log(`Lost report with ID ${id} not found`);
				res.status(404).json({
					status: "error",
					message: `Lost report with ID ${id} not found`,
				});
				return;
			}
		} catch (error) {
			console.log(`Error finding lost report with ID ${id}:`, error);
			// If it's an invalid ObjectId, return 404
			if (
				error &&
				typeof error === "object" &&
				"name" in error &&
				"kind" in error
			) {
				if (error.name === "CastError" && error.kind === "ObjectId") {
					res.status(404).json({
						status: "error",
						message: `Invalid lost report ID format: ${id}`,
					});
					return;
				}
			}
			// Handle other errors
			res.status(500).json({
				status: "error",
				message:
					error instanceof Error
						? error.message
						: "An error occurred while finding the lost report",
			});
			return;
		}

		const matches = await MatchingService.findMatchesForLostReport(id);
		console.log(
			`Found ${matches.length} matches for lost report ID: ${id}`
		);

		// Format the matches to be consistent with found report matches
		const formattedMatches = matches.map((match, index) => {
			return {
				id: match.id || `match_${index}`,
				similarity_score: match.similarity_score || 0.5,
				document: match.document || {},
				foundItem: match.document || {}, // For consistency with frontend expectations
				lostItem: {
					id: id,
					_id: id,
				},
			};
		});

		res.json({
			lostReportId: id,
			matches: formattedMatches,
			totalMatches: matches.length,
			highConfidenceMatches:
				MatchingService.getHighConfidenceMatches(matches).length,
		});
	} catch (err) {
		console.error(
			`Error finding matches for lost report ${req.params.id}:`,
			err
		);
		res.status(500).json({
			status: "error",
			message:
				err instanceof Error
					? err.message
					: "Failed to find matches for lost report",
		});
	}
};

export const findMatchesForFoundReportController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params;
		console.log(`Finding matches for found report ID: ${id}`);
		console.log(`Request path: ${req.path}, params:`, req.params);

		if (!id) {
			res.status(400).json({
				status: "error",
				message: "Found report ID is required",
			});
			return;
		}

		// Try to find the found report first to verify it exists
		try {
			const foundReport = await FoundReport.findById(id).exec();
			if (!foundReport) {
				console.log(`Found report with ID ${id} not found`);
				res.status(404).json({
					status: "error",
					message: `Found report with ID ${id} not found`,
				});
				return;
			}
		} catch (error) {
			console.log(`Error finding found report with ID ${id}:`, error);
			// If it's an invalid ObjectId, return 404
			if (
				error &&
				typeof error === "object" &&
				"name" in error &&
				"kind" in error
			) {
				if (error.name === "CastError" && error.kind === "ObjectId") {
					res.status(404).json({
						status: "error",
						message: `Invalid found report ID format: ${id}`,
					});
					return;
				}
			}
			// Handle other errors
			res.status(500).json({
				status: "error",
				message:
					error instanceof Error
						? error.message
						: "An error occurred while finding the found report",
			});
			return;
		}

		// Get all types of matches
		console.log(`Retrieving image matches for found report ${id}`);
		const imageMatches = await MatchingService.findMatchesForFoundReport(
			id
		);

		console.log(`Retrieving text matches for found report ${id}`);
		const textMatches = await MatchingService.findTextMatchesForFoundReport(
			id
		);

		console.log(`Retrieving combined matches for found report ${id}`);
		const combinedMatches =
			await MatchingService.findCombinedMatchesForFoundReport(id);

		// Get the report to include in responses
		const foundReport = await FoundReport.findById(id);
		if (!foundReport) {
			res.status(404).json({
				status: "error",
				message: "Found report not found",
			});
			return;
		}

		console.log(
			`Found matches for report ${id}: Image: ${imageMatches.length}, Text: ${textMatches.length}, Combined: ${combinedMatches.length}`
		);

		// Helper function to safely get finder name and ID
		const getFinderDetails = (report: any) => {
			return {
				name:
					report.finder &&
					typeof report.finder === "object" &&
					"name" in report.finder
						? (report.finder.name as string)
						: "Anonymous",
				id:
					report.finder &&
					typeof report.finder === "object" &&
					"_id" in report.finder
						? (report.finder._id as any).toString()
						: "unknown",
			};
		};

		// Helper function to safely get report ID
		const getReportId = (report: any) => {
			return report._id ? (report._id as any).toString() : id;
		};

		// Format the matches in a frontend-friendly way with rich details
		const formattedImageMatches = imageMatches.map((match, index) => ({
			id: `image_result_${match.id || index}`,
			matchingScore: Math.round((match.similarity_score || 0.5) * 100),
			source: "Image Analysis",
			lostItem: {
				id: match.document?._id || `lost_item_${index}`,
				name: match.document?.itemDetails?.name || "Unknown Item",
				description:
					match.document?.itemDetails?.description ||
					"No description available",
				category:
					match.document?.itemDetails?.category || "Uncategorized",
				dateLost: match.document?.lostDate
					? new Date(match.document.lostDate)
							.toISOString()
							.split("T")[0]
					: "Unknown",
				location: match.document?.lostLocation || "Unknown location",
				image: match.document?.image?.url || "",
				attributes: match.document?.attributes || {},
				owner: {
					name: match.document?.reporter?.name || "Anonymous",
					id: match.document?.reporter?._id || "unknown",
				},
				...match.document,
			},
			foundItem: {
				id: getReportId(foundReport),
				name: foundReport.itemDetails?.name || "Found Item",
				description:
					foundReport.itemDetails?.description ||
					"No description available",
				category: foundReport.itemDetails?.category || "Uncategorized",
				dateFound: foundReport.foundDate
					? new Date(foundReport.foundDate)
							.toISOString()
							.split("T")[0]
					: "Unknown",
				location: foundReport.foundLocation || "Unknown location",
				image: foundReport.image?.url || "",
				attributes: foundReport.attributes || {},
				finder: getFinderDetails(foundReport),
			},
		}));

		const formattedTextMatches = textMatches.map((match, index) => ({
			id: `text_result_${match.id || index}`,
			matchingScore: Math.round((match.similarity_score || 0.5) * 100),
			source: "Text Analysis",
			lostItem: {
				id: match.document?._id || `lost_item_${index}`,
				name: match.document?.itemDetails?.name || "Unknown Item",
				description:
					match.document?.itemDetails?.description ||
					"No description available",
				category:
					match.document?.itemDetails?.category || "Uncategorized",
				dateLost: match.document?.lostDate
					? new Date(match.document.lostDate)
							.toISOString()
							.split("T")[0]
					: "Unknown",
				location: match.document?.lostLocation || "Unknown location",
				image: match.document?.image?.url || "",
				attributes: match.document?.attributes || {},
				owner: {
					name: match.document?.reporter?.name || "Anonymous",
					id: match.document?.reporter?._id || "unknown",
				},
				...match.document,
			},
			foundItem: {
				id: getReportId(foundReport),
				name: foundReport.itemDetails?.name || "Found Item",
				description:
					foundReport.itemDetails?.description ||
					"No description available",
				category: foundReport.itemDetails?.category || "Uncategorized",
				dateFound: foundReport.foundDate
					? new Date(foundReport.foundDate)
							.toISOString()
							.split("T")[0]
					: "Unknown",
				location: foundReport.foundLocation || "Unknown location",
				image: foundReport.image?.url || "",
				attributes: foundReport.attributes || {},
				finder: getFinderDetails(foundReport),
			},
		}));

		const formattedCombinedMatches = combinedMatches.map(
			(match, index) => ({
				id: `combined_result_${match.id || index}`,
				matchingScore: Math.round(
					(match.similarity_score || 0.5) * 100
				),
				source: "Combined Analysis",
				lostItem: {
					id: match.document?._id || `lost_item_${index}`,
					name: match.document?.itemDetails?.name || "Unknown Item",
					description:
						match.document?.itemDetails?.description ||
						"No description available",
					category:
						match.document?.itemDetails?.category ||
						"Uncategorized",
					dateLost: match.document?.lostDate
						? new Date(match.document.lostDate)
								.toISOString()
								.split("T")[0]
						: "Unknown",
					location:
						match.document?.lostLocation || "Unknown location",
					image: match.document?.image?.url || "",
					attributes: match.document?.attributes || {},
					owner: {
						name: match.document?.reporter?.name || "Anonymous",
						id: match.document?.reporter?._id || "unknown",
					},
					...match.document,
				},
				foundItem: {
					id: getReportId(foundReport),
					name: foundReport.itemDetails?.name || "Found Item",
					description:
						foundReport.itemDetails?.description ||
						"No description available",
					category:
						foundReport.itemDetails?.category || "Uncategorized",
					dateFound: foundReport.foundDate
						? new Date(foundReport.foundDate)
								.toISOString()
								.split("T")[0]
						: "Unknown",
					location: foundReport.foundLocation || "Unknown location",
					image: foundReport.image?.url || "",
					attributes: foundReport.attributes || {},
					finder: getFinderDetails(foundReport),
				},
			})
		);

		// Prepare the frontend-friendly response
		const response = {
			foundReportId: id,
			itemName: foundReport.itemDetails?.name || "Found item",
			searchResults: {
				text: formattedTextMatches,
				image: formattedImageMatches,
				combined: formattedCombinedMatches,
			},
			totalMatches:
				formattedTextMatches.length +
				formattedImageMatches.length +
				formattedCombinedMatches.length,
		};

		res.json(response);
	} catch (err) {
		console.error(
			`Error finding matches for found report ${req.params.id}:`,
			err
		);
		res.status(500).json({
			status: "error",
			message:
				err instanceof Error
					? err.message
					: "Failed to find matches for found report",
		});
	}
};
