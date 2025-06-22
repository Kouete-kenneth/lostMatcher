import mongoose, { Document, Schema, Types, Model } from "mongoose";

/**
 * Enum for the notification type
 */

export enum NotificationType {
	System = "system",
	Match = "match",
	Claim = "claim",
	Feedback = "feedback",
}

/**
 * Enum for the notification read status
 */
export enum NotificationStatus {
	Read = "read",
	Unread = "unread",
}

/**
 * Notification interface
 */
export interface INotification extends Document {
	recipients: Types.ObjectId[];
	senderId?: Types.ObjectId;
	type: NotificationType;
	title: string;
	content: string;
	link?: string;
	status: NotificationStatus;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * Notification schema
 */
const notificationSchema = new Schema<INotification>(
	{
		recipients: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		senderId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		type: {
			type: String,
			enum: Object.values(NotificationType),
			default: NotificationType.System,
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		link: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: Object.values(NotificationStatus),
			default: NotificationStatus.Unread,
		},
	},
	{
		timestamps: true,
	}
);

/**
 * Notification model
 */
const Notification: Model<INotification> = mongoose.model<INotification>(
	"Notification",
	notificationSchema
);

export default Notification;
