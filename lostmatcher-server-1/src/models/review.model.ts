import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  rating: number;
  visibility?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
