import { Request, Response } from "express";
import httpStatus from "http-status";
import logging from "../config/logging.config";
import { PeriodicSearchService } from "../services/periodicSearch.service";
import User from "../models/user.model";

export const getPeriodicSearchStatus = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = (req.user as any)?.id;
		if (!userId) {
			res.status(httpStatus.UNAUTHORIZED).json({
				message: "User not authenticated",
			});
			return;
		}

		const user = await User.findById(userId);
		if (!user) {
			res.status(httpStatus.NOT_FOUND).json({
				message: "User not found",
			});
			return;
		}

		const serviceStatus = PeriodicSearchService.isServiceRunning();
		const nextRunTime = PeriodicSearchService.getNextRunTime();

		res.status(httpStatus.OK).json({
			message: "Periodic search status retrieved successfully",
			data: {
				userEnabled: user.periodicSearchEnabled,
				serviceRunning: serviceStatus,
				nextRunTime: nextRunTime,
				matchingThreshold: user.matchingThreshold,
			},
		});
	} catch (error: unknown) {
		logging.error("Failed to get periodic search status:", error);
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			message: "Failed to get periodic search status",
			error: errorMessage,
		});
	}
};

export const updatePeriodicSearchSettings = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = (req.user as any)?.id;
		if (!userId) {
			res.status(httpStatus.UNAUTHORIZED).json({
				message: "User not authenticated",
			});
			return;
		}

		const { periodicSearchEnabled, matchingThreshold } = req.body;

		const updateData: any = {};
		if (typeof periodicSearchEnabled === "boolean") {
			updateData.periodicSearchEnabled = periodicSearchEnabled;
		}
		if (
			typeof matchingThreshold === "number" &&
			matchingThreshold >= 0 &&
			matchingThreshold <= 100
		) {
			updateData.matchingThreshold = matchingThreshold;
		}

		if (Object.keys(updateData).length === 0) {
			res.status(httpStatus.BAD_REQUEST).json({
				message: "No valid settings provided",
			});
			return;
		}

		const user = await User.findByIdAndUpdate(userId, updateData, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			res.status(httpStatus.NOT_FOUND).json({
				message: "User not found",
			});
			return;
		}

		logging.info(
			`Updated periodic search settings for user ${userId}:`,
			updateData
		);

		res.status(httpStatus.OK).json({
			message: "Periodic search settings updated successfully",
			data: {
				periodicSearchEnabled: user.periodicSearchEnabled,
				matchingThreshold: user.matchingThreshold,
			},
		});
	} catch (error: unknown) {
		logging.error("Failed to update periodic search settings:", error);
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			message: "Failed to update periodic search settings",
			error: errorMessage,
		});
	}
};

export const triggerManualPeriodicSearch = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const userId = (req.user as any)?.id;
		if (!userId) {
			res.status(httpStatus.UNAUTHORIZED).json({
				message: "User not authenticated",
			});
			return;
		}

		// Run periodic search for the specific user
		await PeriodicSearchService.runSearchForUser(userId);

		res.status(httpStatus.OK).json({
			message: "Manual periodic search triggered successfully",
		});
	} catch (error: unknown) {
		logging.error("Failed to trigger manual periodic search:", error);
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			message: "Failed to trigger manual periodic search",
			error: errorMessage,
		});
	}
};

export const triggerPeriodicSearchForReport = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { reportId, reportType } = req.params;

		if (
			!reportId ||
			!reportType ||
			!["lost", "found"].includes(reportType)
		) {
			res.status(httpStatus.BAD_REQUEST).json({
				message:
					"Valid reportId and reportType (lost/found) are required",
			});
			return;
		}

		await PeriodicSearchService.runSearchForReport(
			reportId,
			reportType as "lost" | "found"
		);

		res.status(httpStatus.OK).json({
			message: `Periodic search triggered successfully for ${reportType} report ${reportId}`,
		});
	} catch (error: unknown) {
		logging.error("Failed to trigger periodic search for report:", error);
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			message: "Failed to trigger periodic search for report",
			error: errorMessage,
		});
	}
};

export const getServiceStats = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const serviceStatus = PeriodicSearchService.isServiceRunning();
		const nextRunTime = PeriodicSearchService.getNextRunTime();

		// Get count of users with periodic search enabled
		const usersWithPeriodicSearch = await User.countDocuments({
			periodicSearchEnabled: true,
			accountStatus: "active",
		});

		res.status(httpStatus.OK).json({
			message: "Service statistics retrieved successfully",
			data: {
				serviceRunning: serviceStatus,
				nextRunTime: nextRunTime,
				usersWithPeriodicSearchEnabled: usersWithPeriodicSearch,
			},
		});
	} catch (error: unknown) {
		logging.error("Failed to get service stats:", error);
		const errorMessage =
			error instanceof Error ? error.message : String(error);
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			message: "Failed to get service statistics",
			error: errorMessage,
		});
	}
};
