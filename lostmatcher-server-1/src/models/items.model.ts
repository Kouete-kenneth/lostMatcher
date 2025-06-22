import { Document, Schema, model, Types } from "mongoose";

export interface IItem extends Document {
	owner: Types.ObjectId;
	name: string;
	description: string;
	category: string;
	attributes: Record<string, string>;
	images: string[];
	registrationDate?: Date;
}

const itemSchema = new Schema<IItem>(
	{
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		description: { type: String },
		category: { type: String, required: true },
		attributes: { type: Map, of: String },
		images: [String],
		registrationDate: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export default model<IItem>("Item", itemSchema);
