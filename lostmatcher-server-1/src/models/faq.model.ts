import mongoose, { Document, Schema } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FAQSchema: Schema<IFAQ> = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model<IFAQ>("FAQ", FAQSchema);
export default FAQ;