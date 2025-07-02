import FormData from "form-data";
import axios from "axios";
import logging from "../config/logging.config";
import fs from "fs";

export interface ImageFeatures {
	descriptors: string;
	descriptors_shape?: [number, number];
	keypoints_count: number;
	keypoints: any[];
	image_shape?: [number, number];
	filename?: string;
	message?: string;
	success?: boolean;
}

export interface ComparisonResult {
	is_match: boolean;
	similarity_score: number;
	matches_count: number;
	confidence: number;
}

export interface RobustMatcherResponse {
	comparison: {
		confidence: string;
		features1_count: number;
		features2_count: number;
		good_matches: number;
		match_ratio: number;
		similarity_score: number;
		total_matches: number;
	};
	comparison_timestamp: string;
	input_features1_count: number;
	input_features2_count: number;
	success: boolean;
}

export class ImageMatchingService {
	private static readonly EXTRACT_FEATURES_URL =
		"https://robust-image-matcher-minimal-latest.onrender.com/extract-features";
	private static readonly COMPARE_FEATURES_URL =
		"https://robust-image-matcher-minimal-latest.onrender.com/compare-features";
	private static readonly TIMEOUT = 60000; // 60 seconds

	/**
	 * Extract features from an uploaded image file
	 */
	static async extractFeatures(
		file: Express.Multer.File
	): Promise<ImageFeatures> {
		try {
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

			formData.append("image", fileBuffer, {
				filename: file.originalname,
				contentType: file.mimetype,
			});

			logging.info(
				"Extracting features from image using robust image matching service..."
			);

			const response = await axios.post(
				this.EXTRACT_FEATURES_URL,
				formData,
				{
					headers: {
						...formData.getHeaders(),
					},
					timeout: this.TIMEOUT,
				}
			);

			logging.info("Feature extraction completed successfully");

			// Debug: Log the raw response
			// Assert response.data as any to safely access its properties
			const data = response.data as { features: any };
			const rawData = data.features as any;

			// logging.info(
			// 	"Raw image matching response:",
			// 	JSON.stringify(rawData.descriptors, null, 2)
			// );

			// Transform the response to match our interface

			// Handle descriptors conversion (array to string)
			let descriptorsString = "";
			if (rawData.descriptors && Array.isArray(rawData.descriptors)) {
				descriptorsString = JSON.stringify(rawData.descriptors);
			} else if (typeof rawData.descriptors === "string") {
				descriptorsString = rawData.descriptors;
			}

			// Handle keypoints conversion (ensure it's an array)
			let keypointsArray = [];
			if (rawData.keypoints && Array.isArray(rawData.keypoints)) {
				keypointsArray = rawData.keypoints;
			}

			const features: ImageFeatures = {
				descriptors: descriptorsString,
				descriptors_shape: rawData.descriptors_shape || undefined,
				keypoints_count: rawData.keypoints_count || 0,
				keypoints: keypointsArray,
				image_shape: rawData.image_shape || undefined,
				filename: rawData.filename,
				message: rawData.message,
				success: rawData.success !== false, // Default to true unless explicitly false
			};

			// // Debug: Log the transformed features
			// logging.info("Transformed features:", {
			// 	descriptors_length: features.descriptors.length,
			// 	keypoints_count: features.keypoints_count,
			// 	keypoints_array_length: features.keypoints.length,
			// 	has_descriptors_shape: !!features.descriptors_shape,
			// 	has_image_shape: !!features.image_shape,
			// 	success: features.success,
			// });

			// Return the features in the expected format
			return features;
		} catch (error: unknown) {
			logging.error("Feature extraction request failed:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to extract image features: ${errorMessage}`
			);
		}
	}

	/**
	 * Map string confidence to numeric value
	 */
	private static mapConfidenceToNumber(confidence: string): number {
		switch (confidence.toLowerCase()) {
			case "high":
				return 0.8;
			case "medium":
				return 0.5;
			case "low":
				return 0.2;
			default:
				return 0.3;
		}
	}

	/**
	 * Compare two sets of image features
	 */
	static async compareFeatures(
		features1: ImageFeatures,
		features2: ImageFeatures
	): Promise<ComparisonResult> {
		try {
			logging.info(
				"Comparing image features using robust image matching service..."
			);

			const response = await axios.post(
				this.COMPARE_FEATURES_URL,
				{
					features1,
					features2,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
					timeout: this.TIMEOUT,
				}
			);

			logging.info("Feature comparison completed successfully");

			// Parse the actual response structure
			const robustResponse = response.data as RobustMatcherResponse;

			// Transform to our expected interface
			const result: ComparisonResult = {
				is_match: robustResponse.comparison.similarity_score > 15, // Adjust threshold as needed
				similarity_score: Math.min(
					robustResponse.comparison.similarity_score / 100,
					1
				), // Convert to 0-1 scale, cap at 1
				matches_count: robustResponse.comparison.good_matches,
				confidence: this.mapConfidenceToNumber(
					robustResponse.comparison.confidence
				),
			};

			logging.info(
				`Transformed comparison result: similarity=${result.similarity_score}, confidence=${result.confidence}, matches=${result.matches_count}`
			);

			return result;
		} catch (error: unknown) {
			logging.error("Feature comparison request failed:", error);
			const errorMessage: string =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to compare image features: ${errorMessage}`
			);
		}
	}

	/**
	 * Extract features from image buffer (utility method)
	 */
	static async extractFeaturesFromBuffer(
		imageBuffer: Buffer,
		filename: string,
		mimetype: string
	): Promise<ImageFeatures> {
		const mockFile: Express.Multer.File = {
			buffer: imageBuffer,
			originalname: filename,
			mimetype: mimetype,
			fieldname: "image",
			encoding: "7bit",
			size: imageBuffer.length,
			destination: "",
			filename: filename,
			path: "",
			stream: null as any,
		};

		return this.extractFeatures(mockFile);
	}
}
