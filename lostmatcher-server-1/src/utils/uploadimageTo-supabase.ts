import { createClient } from "@supabase/supabase-js";
import config from "../config/env.config";
import ApiError from "./ApiError";
import httpStatus from "http-status";
import logging from "../config/logging.config";

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;
const BUCKET_NAME = config.supabase.bucketName;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads an image to Supabase Storage, placing it in a specified folder.
 * @param fileBuffer Buffer of the image file.
 * @param fileName Name of the file (e.g., "image.jpg").
 * @param folder Folder name in Supabase Storage (e.g., "avatars", "posts").
 * @returns Public URL of the uploaded image or throws error.
 */
export const uploadImageToSupabase = async (
	fileBuffer: Buffer,
	fileName: string,
	folder: string
): Promise<string> => {
	if (!supabaseUrl || !supabaseKey) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Supabase configuration is missing."
		);
	}
	logging.info(
		`File Name: ${fileName}, Folder: ${folder},buffer: ${fileBuffer.length} bytes`
	);

	const filePath = `${folder}/${Date.now()}_${fileName}`;
	const { error: uploadError } = await supabase.storage
		.from(BUCKET_NAME)
		.upload(filePath, fileBuffer, {
			cacheControl: "3600",
			upsert: false,
			contentType: getContentType(fileName),
		});

	if (uploadError) {
		throw new Error(`Failed to upload image: ${uploadError.message}`);
	}

	const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

	if (!data || !data.publicUrl) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to get public URL: Unknown error"
		);
	}

	return data.publicUrl;
};

// Helper to guess content type from file extension
const getContentType = (fileName: string): string => {
	const ext = fileName.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "jpg":
		case "jpeg":
			return "image/jpeg";
		case "png":
			return "image/png";
		case "gif":
			return "image/gif";
		case "webp":
			return "image/webp";
		default:
			return "application/octet-stream";
	}
};
