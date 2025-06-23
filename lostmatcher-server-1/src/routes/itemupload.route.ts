import { Router } from "express";
import { uploadItemWithImage } from "../controllers/itemupload.controller";
import multer from "multer";
import { auth } from "../middlewares/auth";

// Configure multer for file uploads (you can customize storage as needed)
const upload = multer({ dest: "uploads/" });

const uploadRoutes = Router();

// POST /api/items/upload
uploadRoutes.post(
	"/upload",
	auth(),
	upload.single("file"), // expecting the image file field to be named 'file'
	uploadItemWithImage
);

export default uploadRoutes;
