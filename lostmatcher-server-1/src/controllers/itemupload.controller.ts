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
			const user = req.user as IUser
			const owner = user?._id || req.body.owner; // Use user ID from auth middleware or from request body
			if (!owner) {
				throw new ApiError(
					httpStatus.BAD_REQUEST,
					"Owner ID is required"
				);
			}
			
			let { category, itemDetails, attributes } = req.body;
			const file = req.file;
			logger.info("Received file for item upload:", file?.originalname);
			
			// Parse attributes if it's a string
			if (attributes && typeof attributes === 'string') {
				try {
					attributes = JSON.parse(attributes);
				} catch (error) {
					throw new ApiError(
						httpStatus.BAD_REQUEST,
						"Invalid attributes format"
					);
				}
			}

			// Validate required fields based on mongoose schema
			if (!category) {
				throw new ApiError(
					httpStatus.BAD_REQUEST,
					"Category is required"
				);
			}

			if (
				!itemDetails ||
				!itemDetails.name ||
				!itemDetails.description ||
				!itemDetails.category
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
				itemDetails,
				attributes,
				file,
			});

			res.status(201).json({
				status: "success",
				data: item,
			});
		} catch (err) {
			next(err);
		}
	}
);
