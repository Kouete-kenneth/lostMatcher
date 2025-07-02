import itemsModel from "../models/items.model";
import { uploadImageToSupabase } from "../utils/uploadimageTo-supabase";
import { ImageMatchingService } from "./imageMatching.service";
import logging from "../config/logging.config";

type MulterFile = Express.Multer.File;

export class ItemUploadService {
	static async uploadItemWithImage(data: {
		owner: string;
		itemDetails: any;
		attributes?: any;
		file: MulterFile;
	}) {
		const { owner, itemDetails, attributes, file } = data;

		if (!file) throw new Error("Image file is required");

		logging.info("Uploading item with image and extracting features...");

		try {
			// Extract features using the new ImageMatchingService
			const features = await ImageMatchingService.extractFeatures(file);

			console.log("Extracted features:", features.descriptors);
			// Debug: Log the extracted features
			// logging.info("Extracted features:", {
			// 	descriptors_length: features.descriptors?.length || 0,
			// 	descriptors_shape: features.descriptors_shape,
			// 	keypoints_count: features.keypoints_count,
			// 	keypoints_length: features.keypoints?.length || 0,
			// 	image_shape: features.image_shape,
			// });

			// Upload image to Supabase
			const fileData = file.buffer;
			if (!fileData) {
				throw new Error("File buffer is missing");
			}

			const imageUrl = await uploadImageToSupabase(
				fileData,
				file.originalname,
				"items" // Folder name in storage
			);

			// Create the item with extracted features
			const item = new itemsModel({
				owner,
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
				registrationDate: new Date(),
			});

			await item.save();
			logging.info("Item created successfully with extracted features");
			return item;
		} catch (error: unknown) {
			logging.error("Failed to upload item with image:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to upload item with image: ${errorMessage}`
			);
		}
	}
}
