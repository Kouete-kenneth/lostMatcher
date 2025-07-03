import { Request, Response, NextFunction } from "express";
import { ItemUploadService } from "../services/itemupload.service";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import logger from "../config/logging.config";
import { IUser } from "../models/user.model";

export const uploadItemWithImage = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as IUser;
			const owner = user?._id || req.body.owner; // Use user ID from auth middleware or from request body
			if (!owner) {
				throw new ApiError(
					httpStatus.BAD_REQUEST,
					"Owner ID is required"
				);
			}

			let { itemDetails, attributes } = req.body;
			const file = req.file;
			logger.info("Received file for item upload:", file?.originalname);

			// Parse itemDetails if it's a string (from FormData)
			let parsedItemDetails = itemDetails;
			if (typeof itemDetails === "string") {
				try {
					parsedItemDetails = JSON.parse(itemDetails);
				} catch (e) {
					throw new ApiError(
						httpStatus.BAD_REQUEST,
						"Invalid itemDetails format"
					);
				}
			}

			// Parse attributes if it's a string
			let parsedAttributes = attributes;
			if (attributes && typeof attributes === "string") {
				try {
					parsedAttributes = JSON.parse(attributes);
				} catch (error) {
					throw new ApiError(
						httpStatus.BAD_REQUEST,
						"Invalid attributes format"
					);
				}
			}

			// Validate required fields based on mongoose schema
			if (!parsedItemDetails?.category) {
				throw new ApiError(
					httpStatus.BAD_REQUEST,
					"Category is required"
				);
			}

			if (
				!parsedItemDetails ||
				!parsedItemDetails.name ||
				!parsedItemDetails.description ||
				!parsedItemDetails.category
			) {
				throw new ApiError(
					httpStatus.BAD_REQUEST,
					"Item details (name, description, category) are required"
				);
			}

			if (!file) {
				throw new ApiError(
					httpStatus.NOT_ACCEPTABLE,
					"Image file is required"
				);
			}

			const item = await ItemUploadService.uploadItemWithImage({
				owner,
				itemDetails: parsedItemDetails,
				attributes: parsedAttributes,
				file,
			});

			res.status(201).json({
				status: "success",
				data: item,
				// Include the fields needed by the frontend
				id: (item._id as any).toString(),
				itemName: parsedItemDetails.name || "Registered Item",
				description: parsedItemDetails.description || "",
				category: parsedItemDetails.category || "",
			});
		} catch (err) {
			console.error("Error uploading item:", err);
			res.status(
				err instanceof ApiError
					? err.statusCode
					: httpStatus.INTERNAL_SERVER_ERROR
			).json({
				status: "error",
				message:
					err instanceof Error
						? err.message
						: "Failed to upload item",
			});
		}
	}
);
