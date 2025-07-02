import { Document, Schema, model, Types } from "mongoose";

// src/models/FoundReport.ts
export enum FoundStatus {
	Active = "active",
	Pending = "pending",
	Claimed = "claimed",
	Approved = "approved",
	NotMatch = "not_match",
	Resolved = "resolved",
	Inactive = "inactive",
}

export interface IFoundReport extends Document {
	finder: Types.ObjectId;
	itemDetails?: {
		name: string;
		description: string;
		category: string;
	};
	attributes: Record<string, string>;
	image: {
		url: string;
		descriptors?: string;
		descriptors_shape?: [number, number];
		keypoints_count?: number;
		keypoints?: any[];
		image_shape?: [number, number];
	};
	foundDate: Date;
	foundLocation: string;
	status: FoundStatus;
}

const foundReportSchema = new Schema<IFoundReport>(
	{
		finder: { type: Schema.Types.ObjectId, ref: "User", required: true },
		itemDetails: {
			name: String,
			description: String,
			category: String,
		},
		attributes: { type: Map, of: String },
		image: {
			url: { type: String, required: true },
			descriptors: { type: String, required: false },
			descriptors_shape: { type: [Number], required: false },
			keypoints_count: { type: Number, required: false },
			keypoints: { type: Array, default: [] },
			image_shape: { type: [Number], required: false },
		},
		foundDate: { type: Date, required: true },
		foundLocation: { type: String, required: true },
		status: {
			type: String,
			enum: Object.values(FoundStatus),
			default: FoundStatus.Pending,
		},
	},
	{ timestamps: true }
);

export const FoundReport = model<IFoundReport>(
	"FoundReport",
	foundReportSchema
);
