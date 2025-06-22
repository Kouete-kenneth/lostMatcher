import { Document, Schema, model, Types } from "mongoose";

export enum LostStatus {
	Active = "active",
	Pending = "pending",
	Matched = "matched",
	Resolved = "resolved",
	Inactive = "inactive",
}

export interface ILostReport extends Document {
	reporter: Types.ObjectId;
	item?: Types.ObjectId;
	itemDetails?: {
		name: string;
		description: string;
		category: string;
	};
	attributes: Record<string, string>;
    image: {
        url: string;
        keypoints: any[];
        descriptors: any[];
    };
	lostDate: Date;
	lostLocation: string;
	status: LostStatus;
}

const lostReportSchema = new Schema<ILostReport>(
    {
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        item: { type: Schema.Types.ObjectId, ref: "Item" },
        itemDetails: {
            name: String,
            description: String,
            category: String,
        },
        attributes: { type: Map, of: String },
        image: {
            url: { type: String, required: true },
            keypoints: { type: Array, default: [] }, // ORB keypoints
            descriptors: { type: Array, default: [] }, // ORB descriptors
        },
        lostDate: { type: Date, required: true },
        lostLocation: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(LostStatus),
            default: LostStatus.Pending,
        },
    },
    { timestamps: true }
);

export const LostReport = model<ILostReport>("LostReport", lostReportSchema);
