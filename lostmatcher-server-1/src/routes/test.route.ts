import { Router } from "express";
import { TestController } from "../controllers/test.controller";
import multer from "multer";

const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: (req, file, cb) => {
		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
		];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});

const router = Router();

/**
 * @route POST /api/test-extract-features
 * @desc Test feature extraction from an image
 * @access Public (for testing only)
 */
router.post(
	"/test-extract-features",
	upload.single("image"),
	TestController.testExtractFeatures
);

/**
 * @route POST /api/test-comparison
 * @desc Test feature comparison
 * @access Public (for testing only)
 */
router.post("/test-comparison", TestController.testCompareFeatures);

export default router;
