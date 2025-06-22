import { Document, Schema, model, Types } from "mongoose";
export enum ClaimStatus {
	Pending = "pending",
	Approved = "approved",
	Rejected = "rejected",
	Resolved = "resolved",
}

export interface IClaim extends Document {
	matchId: Types.ObjectId;
	claimantId: Types.ObjectId;
	claimDate: Date;
	status: ClaimStatus;
	adminNotes?: string;
}

const claimSchema = new Schema<IClaim>(
	{
		matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
		claimantId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		claimDate: { type: Date, default: Date.now },
		status: {
			type: String,
			enum: Object.values(ClaimStatus),
			default: ClaimStatus.Pending,
		},
		adminNotes: { type: String },
	},
	{ timestamps: true }
);

export const Claim = model<IClaim>("Claim", claimSchema);
