import { Request, Response, NextFunction } from "express";
import {
	createNotification,
	getAllNotifications,
	updateNotificationById,
	deleteNotification,
} from "../services/notification.service";
import httpStatus from "http-status";

/**
 * Controller function to create a new notification
 */
const addNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const {
			userId,
			senderId,
			content,
			status,
			title,
			linkText,
			recipientType,
			recipients,
		} = req.body;

		const notification = await createNotification({
			recipients: userId ? [userId] : recipients, // Convert userId to recipients array if provided
			senderId,
			content,
			status,
			title,
			link: linkText, // Map linkText to link field in model
			type: "system", // Default type since it's required
		});

		res.status(201).json(notification);
	} catch (error) {
		next(error);
	}
};

/**
 * Controller function to fetch all notifications for a user
 */
const getNotifications = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { userId } = req.params;

		const notifications = await getAllNotifications(userId);

		res.json(notifications);
	} catch (error) {
		next(error);
	}
};

/**
 * Controller function to delete a notification
 */
const removeNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { notificationId } = req.params;

		const deletedNotification = await deleteNotification(notificationId);

		res.json(deletedNotification);
	} catch (error) {
		next(error);
	}
};

/**
 * Controller to handle updating a notification by ID.
 */
const updateNotification = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { notificationId } = req.params;
		const updateBody = req.body;

		const updatedNotification = await updateNotificationById(
			notificationId,
			updateBody
		);

		res.status(httpStatus.OK).json(updatedNotification);
	} catch (error) {
		next(error);
	}
};

export {
	addNotification,
	getNotifications,
	removeNotification,
	updateNotification,
};
