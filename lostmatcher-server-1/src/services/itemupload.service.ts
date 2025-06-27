import itemsModel from "../models/items.model";
import FormData from "form-data";
import axios from "axios";
import { uploadImageToSupabase } from "../utils/uploadimageTo-supabase";
import logging from "../config/logging.config";
import fs from "fs";
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

		const formData = new FormData();
		// Ensure the file buffer is a Buffer, not a stream or undefined
		let fileBuffer: Buffer;
		if (file.buffer) {
			fileBuffer = Buffer.from(file.buffer);
		} else if (file.path) {
			fileBuffer = await fs.promises.readFile(file.path);
		} else {
			throw new Error("File buffer and file path are both missing.");
		}
		formData.append("file", fileBuffer, {
			filename: file.originalname,
			contentType: file.mimetype,
		});
		logging.info(formData);
		logging.info("Uploading image to feature extraction service...");
		let response;
		try {
			response = await axios.post(
				"https://lostmatcher-latest.onrender.com/extract-features",
				formData,
				{
					headers: {
						...formData.getHeaders(),
					},
					timeout: 60000, // Increased timeout to 60 seconds
				}
			);
			logging.info("Feature extraction request completed successfully");
		} catch (error: unknown) {
			logging.error("Feature extraction request failed:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(`Failed to extract features: ${errorMessage}`);
		}

		// Extract keypoints and descriptors from the response
		const { keypoints, descriptors } = response.data as {
			keypoints: any;
			descriptors: any;
		};

		// Use the same fileBuffer as above for upload
		const fileData = file.buffer || (await fs.promises.readFile(file.path));

		const imageUrl = await uploadImageToSupabase(
			fileData,
			file.originalname,
			"items" // Folder name in storage
		);
		const item = new itemsModel({
			owner,
			itemDetails,
			attributes,
			image: { url: imageUrl, keypoints, descriptors },
			registrationDate: new Date(),
		});

		await item.save();
		return item;
	}
}
