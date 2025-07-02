import { Document, Schema, model, Types } from "mongoose";

export interface IItem extends Document {
	owner: Types.ObjectId;
	itemDetails: {
		name: string;
		description: string;
		category: string;
	};
	attributes?: Record<string, string>;
	image?: {
		url: string;
		descriptors?: string;
		descriptors_shape?: [number, number];
		keypoints_count?: number;
		keypoints?: any[];
		image_shape?: [number, number];
	};
	registrationDate?: Date;
}

const itemSchema = new Schema<IItem>(
	{
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		itemDetails: {
			name: { type: String, required: true },
			description: { type: String, required: true },
			category: { type: String, required: true },
		},
		attributes: { type: Map, of: String },
		image: {
			url: { type: String, required: true },
			descriptors: { type: String, required: true },
			descriptors_shape: { type: [Number], required: true },
			keypoints_count: { type: Number, required: false },
			keypoints: { type: [Schema.Types.Mixed], required: false },
			image_shape: { type: [Number], required: false },
		},
		registrationDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default model<IItem>("Item", itemSchema);
