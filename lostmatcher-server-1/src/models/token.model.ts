import mongoose, { Document, Model, Schema } from 'mongoose';
import toJSON from './plugins/toJSON.plugin';
import { tokenTypes } from '../config/tokens.config';

// Define the interface for the Token document
export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: typeof tokenTypes[keyof typeof tokenTypes];
  expires: Date;
  blacklisted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

// Create the model
const Token: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
