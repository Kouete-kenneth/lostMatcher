import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMatch extends Document {
	lostReportId: mongoose.Types.ObjectId;
	foundReportId: mongoose.Types.ObjectId;
	matchScore: number;
	status: "pending_claim" | "claim_approved" | "under_approval";
	createdAt?: Date;
	updatedAt?: Date;
}

export enum MatchStatus {
	PendingClaim = "pending_claim",
	UnderApproval = "under_approval",
	ClaimApproved = "claim_approved",
}

const matchSchema: Schema<IMatch> = new Schema(
	{
		lostReportId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "LostReport",
		},
		foundReportId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "FoundReport",
		},
		matchScore: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(MatchStatus),
			default: MatchStatus.PendingClaim,
		},
	},
	{
		timestamps: true,
	}
);

const Match: Model<IMatch> = mongoose.model<IMatch>("Match", matchSchema);

export default Match;
