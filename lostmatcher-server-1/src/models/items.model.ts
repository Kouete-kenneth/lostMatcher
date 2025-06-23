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
		keypoints?: any[];
		descriptors?: any[];
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
			url: { type: String, required: false },
			keypoints: { type: [Schema.Types.Mixed], required: false },
			descriptors: { type: [Schema.Types.Mixed], required: false },
		},
		registrationDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default model<IItem>("Item", itemSchema);
