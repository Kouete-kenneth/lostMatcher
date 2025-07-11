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

		// Validate that the ID is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			console.log(`Invalid MongoDB ObjectId format: ${id}`);
			res.status(400).json({
				status: "error",
				message: `Invalid lost report ID format. Expected a valid MongoDB ObjectId, got: ${id}`,
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

		const matchingResults = await MatchingService.findMatchesForLostReport(
			id
		);
		console.log(
			`Found matches for lost report ID: ${id} - Image(${matchingResults.summary.imageMatchCount}), Text(${matchingResults.summary.textMatchCount}), Combined(${matchingResults.summary.combinedMatchCount})`
		);

		// Format each set of matches to be consistent with frontend expectations
		const formatMatches = (matches: any[]) => {
			return matches.map((match, index) => {
				return {
					id: match.id || `match_${index}`,
					similarity_score: match.similarity_score || 0.5,
					text_similarity: match.text_similarity || 0,
					confidence: match.confidence || 0.5,
					matches_count: match.matches_count || 0,
					document: match.document || {},
					foundItem: match.document || {}, // For consistency with frontend expectations
					lostItem: {
						id: id,
						_id: id,
					},
				};
			});
		};

		res.json({
			lostReportId: id,
			// Three independent result sets
			imageMatches: formatMatches(matchingResults.imageMatches),
			textMatches: formatMatches(matchingResults.textMatches),
			combinedMatches: formatMatches(matchingResults.combinedMatches),
			// Legacy support - combined matches as default
			matches: formatMatches(matchingResults.combinedMatches),
			// Summary information
			summary: {
				imageMatchCount: matchingResults.summary.imageMatchCount,
				textMatchCount: matchingResults.summary.textMatchCount,
				combinedMatchCount: matchingResults.summary.combinedMatchCount,
				hasImageFeatures: matchingResults.summary.hasImageFeatures,
				hasTextDescription: matchingResults.summary.hasTextDescription,
			},
			// Legacy fields for backward compatibility
			totalMatches: matchingResults.combinedMatches.length,
			highConfidenceMatches: MatchingService.getHighConfidenceMatches(
				matchingResults.combinedMatches
			).length,
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

		// Validate that the ID is a valid MongoDB ObjectId
		if (!mongoose.Types.ObjectId.isValid(id)) {
			console.log(`Invalid MongoDB ObjectId format: ${id}`);
			res.status(400).json({
				status: "error",
				message: `Invalid found report ID format. Expected a valid MongoDB ObjectId, got: ${id}`,
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

		// Get all types of matches using the new unified service
		console.log(`Retrieving all matches for found report ${id}`);
		const matchingResults = await MatchingService.findMatchesForFoundReport(
			id
		);

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
			`Found matches for report ${id}: Image(${matchingResults.summary.imageMatchCount}), Text(${matchingResults.summary.textMatchCount}), Combined(${matchingResults.summary.combinedMatchCount})`
		);

		// Extract the three independent result sets
		const imageMatches = matchingResults.imageMatches;
		const textMatches = matchingResults.textMatches;
		const combinedMatches = matchingResults.combinedMatches;

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

		// Format the matches in a frontend-friendly way with essential details only
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
				image: match.document?.image?.url || "", // Only the image URL
				owner: {
					name: match.document?.reporter?.name || "Anonymous",
					id: match.document?.reporter?._id || "unknown",
				},
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
				image: foundReport.image?.url || "", // Only the image URL
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
				image: match.document?.image?.url || "", // Only the image URL
				owner: {
					name: match.document?.reporter?.name || "Anonymous",
					id: match.document?.reporter?._id || "unknown",
				},
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
				image: foundReport.image?.url || "", // Only the image URL
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
					image: match.document?.image?.url || "", // Only the image URL
					owner: {
						name: match.document?.reporter?.name || "Anonymous",
						id: match.document?.reporter?._id || "unknown",
					},
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
					image: foundReport.image?.url || "", // Only the image URL
					finder: getFinderDetails(foundReport),
				},
			})
		);

		// Prepare the frontend-friendly response with three independent result sets
		const response = {
			foundReportId: id,
			// Three independent result sets (consistent with lost report endpoint)
			imageMatches: formattedImageMatches,
			textMatches: formattedTextMatches,
			combinedMatches: formattedCombinedMatches,
			// Legacy support - combined matches as default
			matches: formattedCombinedMatches,
			// Summary information
			summary: {
				imageMatchCount: matchingResults.summary.imageMatchCount,
				textMatchCount: matchingResults.summary.textMatchCount,
				combinedMatchCount: matchingResults.summary.combinedMatchCount,
				hasImageFeatures: matchingResults.summary.hasImageFeatures,
				hasTextDescription: matchingResults.summary.hasTextDescription,
			},
			// Legacy fields for backward compatibility
			itemName: foundReport.itemDetails?.name || "Found item",
			totalMatches: matchingResults.summary.combinedMatchCount,
			searchResults: {
				text: formattedTextMatches,
				image: formattedImageMatches,
				combined: formattedCombinedMatches,
			},
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
