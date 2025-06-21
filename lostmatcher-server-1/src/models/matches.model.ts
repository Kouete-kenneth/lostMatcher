import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMatch extends Document {
    lostItemId: mongoose.Types.ObjectId;
    foundItemId: mongoose.Types.ObjectId;
    matchScore: number;
    status: 'pending_claim' | 'claim_approved' | 'under_approval';
    createdAt?: Date;
    updatedAt?: Date;
}

const matchSchema: Schema<IMatch> = new Schema(
    {
        lostItemId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'items',
        },
        foundItemId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'items',
        },
        matchScore: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending_claim', 'claim_approved', 'under_approval'],
            default: 'pending_claim',
        },
    },
    {
        timestamps: true,
    }
);

const Match: Model<IMatch> = mongoose.model<IMatch>('Match', matchSchema);

export default Match;
