import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMatch extends Document {
    lostItemId: mongoose.Types.ObjectId;
    foundItemId: mongoose.Types.ObjectId;
    matchScore: number;
    status: 'pending claim' | 'claim approved' | 'further verification required';
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
            enum: ['pending claim', 'claim approved', 'further verification required'],
            default: 'pending claim',
        },
    },
    {
        timestamps: true,
    }
);

const Match: Model<IMatch> = mongoose.model<IMatch>('Match', matchSchema);

export default Match;
