import { Request, Response } from "express";
import { ImageMatchingService } from "../services/imageMatching.service";
import logging from "../config/logging.config";

export class TestController {
	/**
	 * Test feature extraction
	 */
	static async testExtractFeatures(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const file = req.file;
			if (!file) {
				res.status(400).json({
					success: false,
					message: "Image file is required",
				});
				return;
			}

			const features = await ImageMatchingService.extractFeatures(file);

			res.status(200).json({
				success: true,
				message: "Features extracted successfully",
				data: {
					features,
					fileInfo: {
						originalname: file.originalname,
						size: file.size,
						mimetype: file.mimetype,
					},
				},
			});
		} catch (error: any) {
			logging.error("Error testing feature extraction:", error);
			res.status(500).json({
				success: false,
				message: "Failed to extract features",
				error: error.message,
			});
		}
	}

	/**
	 * Test feature comparison
	 */
	static async testCompareFeatures(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { features1, features2 } = req.body;

			if (!features1 || !features2) {
				res.status(400).json({
					success: false,
					message: "Both features1 and features2 are required",
				});
				return;
			}

			const comparison = await ImageMatchingService.compareFeatures(
				features1,
				features2
			);

			res.status(200).json({
				success: true,
				message: "Features compared successfully",
				data: {
					comparison,
					input: {
						features1: {
							descriptors_length:
								features1.descriptors?.length || 0,
							descriptors_shape: features1.descriptors_shape,
							keypoints_count: features1.keypoints_count,
						},
						features2: {
							descriptors_length:
								features2.descriptors?.length || 0,
							descriptors_shape: features2.descriptors_shape,
							keypoints_count: features2.keypoints_count,
						},
					},
				},
			});
		} catch (error: any) {
			logging.error("Error testing feature comparison:", error);
			res.status(500).json({
				success: false,
				message: "Failed to compare features",
				error: error.message,
			});
		}
	}
}
