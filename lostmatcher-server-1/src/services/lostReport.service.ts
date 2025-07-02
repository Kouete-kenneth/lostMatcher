import { LostReport, LostStatus } from "../models/lostReport.model";
import { ImageMatchingService } from "./imageMatching.service";
import { uploadImageToSupabase } from "../utils/uploadimageTo-supabase";
import logging from "../config/logging.config";
import { MatchingService } from "./matching.service";

export class LostReportService {
	static async createLostReportWithImage({
		reporter,
		itemDetails,
		attributes,
		file,
		lostDate,
		lostLocation,
	}: {
		reporter: string;
		itemDetails: any;
		attributes?: any;
		file: Express.Multer.File;
		lostDate: Date;
		lostLocation: string;
	}) {
		if (!file) throw new Error("Image file is required");

		logging.info(
			"Creating lost report with image and extracting features..."
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
				"lost-reports" // Folder name in storage
			);

			// Create the lost report with extracted features
			const report = await LostReport.create({
				reporter,
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
				lostDate,
				lostLocation,
				status: LostStatus.Pending,
			});

			logging.info(
				"Lost report created successfully with extracted features"
			);

			// Automatically trigger matching for the new lost report
			try {
				const reportId = (report._id as any).toString();
				logging.info(
					`Automatically triggering matching for lost report ${reportId}`
				);
				await MatchingService.findMatchesForLostReport(reportId);
				logging.info(
					`Automatic matching completed for lost report ${reportId}`
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
			logging.error("Failed to create lost report with image:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to create lost report with image: ${errorMessage}`
			);
		}
	}

	static async getAllLostReports(filter = {}) {
		return LostReport.find(filter).populate(
			"reporter",
			"username name avatar"
		);
	}

	static async getLostReportById(id: string) {
		return LostReport.findById(id).populate(
			"reporter",
			"username name avatar"
		);
	}

	static async updateLostReportById(id: string, update: any) {
		return LostReport.findByIdAndUpdate(id, update, { new: true });
	}

	static async deleteLostReportById(id: string) {
		return LostReport.findByIdAndDelete(id);
	}
}
