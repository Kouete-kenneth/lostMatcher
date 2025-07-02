import mongoose, { Document, Schema } from "mongoose";

export interface IMatch extends Document {
	lostReportId: mongoose.Types.ObjectId;
	foundReportId: mongoose.Types.ObjectId;
	matchScore: number;
	status: "pending_claim" | "claim_approved" | "under_approval";
	createdAt?: Date;
	updatedAt?: Date;
}

const MatchSchema: Schema = new Schema(
	{
		lostReportId: {
			type: Schema.Types.ObjectId,
			ref: "LostReport",
			required: true,
		},
		foundReportId: {
			type: Schema.Types.ObjectId,
			ref: "FoundReport",
			required: true,
		},
		matchScore: {
			type: Number,
			required: true,
			min: 0,
			max: 1,
		},
		status: {
			type: String,
			enum: ["pending_claim", "claim_approved", "under_approval"],
			default: "pending_claim",
		},
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure unique matches between lost and found reports
MatchSchema.index({ lostReportId: 1, foundReportId: 1 }, { unique: true });

// Index for querying matches by lost report
MatchSchema.index({ lostReportId: 1, matchScore: -1 });

// Index for querying matches by status
MatchSchema.index({ status: 1 });

export default mongoose.model<IMatch>("Match", MatchSchema);
