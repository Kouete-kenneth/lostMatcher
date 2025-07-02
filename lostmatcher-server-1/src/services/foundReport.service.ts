import { FoundReport, FoundStatus } from "../models/foundReport.model";
import { ImageMatchingService } from "./imageMatching.service";
import { uploadImageToSupabase } from "../utils/uploadimageTo-supabase";
import logging from "../config/logging.config";
import { MatchingService } from "./matching.service";

export class FoundReportService {
	static async createFoundReportWithImage({
		finder,
		itemDetails,
		attributes,
		file,
		foundDate,
		foundLocation,
	}: {
		finder: string;
		itemDetails: any;
		attributes?: any;
		file: Express.Multer.File;
		foundDate: Date;
		foundLocation: string;
	}) {
		if (!file) throw new Error("Image file is required");

		logging.info(
			"Creating found report with image and extracting features..."
		);

		try {
			// Extract features using the ImageMatchingService
			const features = await ImageMatchingService.extractFeatures(file);

			// Upload image to Supabase
			const fileData = file.buffer;
			if (!fileData) {
				throw new Error("File buffer is missing");
			}

			const imageUrl = await uploadImageToSupabase(
				fileData,
				file.originalname,
				"found-reports" // Folder name in storage
			);

			// Create the found report with extracted features
			const report = await FoundReport.create({
				finder,
				itemDetails,
				attributes,
				image: {
					url: imageUrl,
					descriptors: features.descriptors,
					descriptors_shape: features.descriptors_shape,
					keypoints_count: features.keypoints_count,
					keypoints: features.keypoints,
					image_shape: features.image_shape,
				},
				foundDate,
				foundLocation,
				status: FoundStatus.Pending,
			});

			logging.info(
				"Found report created successfully with extracted features"
			);

			// Automatically trigger matching for the new found report
			try {
				const reportId = (report._id as any).toString();
				logging.info(
					`Automatically triggering matching for found report ${reportId}`
				);
				await MatchingService.findMatchesForFoundReport(reportId);
				logging.info(
					`Automatic matching completed for found report ${reportId}`
				);
			} catch (matchingError) {
				logging.error(
					"Automatic matching failed, but report was created successfully:",
					matchingError
				);
				// Don't throw error - report was created successfully
			}

			return report;
		} catch (error: unknown) {
			logging.error("Failed to create found report with image:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to create found report with image: ${errorMessage}`
			);
		}
	}

	static async getAllFoundReports(filter = {}) {
		return FoundReport.find(filter).populate(
			"finder",
			"username name avatar"
		);
	}

	static async getFoundReportById(id: string) {
		return FoundReport.findById(id).populate(
			"finder",
			"username name avatar"
		);
	}

	static async updateFoundReportById(id: string, update: any) {
		return FoundReport.findByIdAndUpdate(id, update, { new: true });
	}

	static async deleteFoundReportById(id: string) {
		return FoundReport.findByIdAndDelete(id);
	}
}
