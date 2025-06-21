import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrentLocation {
  townOrVillage?: string;
  quarter?: string;
  specificPlace?: string;
}

export interface IItem extends Document {
  imageURL: string;
  description: string;
  name: string;
  missingLocation: string;
  currentLocation?: ICurrentLocation;
  contactPersonContact: string;
  status: 'no_match' | 'pending_claim' | 'claim_approved' | 'under_approval';
  type: 'lost' | 'found';
  descriptors: number[];
  date: Date;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CurrentLocationSchema: Schema = new Schema(
  {
    townOrVillage: { type: String },
    quarter: { type: String },
    specificPlace: { type: String },
  },
  { _id: false }
);

const ItemSchema: Schema = new Schema(
  {
    imageURL: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    missingLocation: { type: String, required: true },
    currentLocation: { type: CurrentLocationSchema },
    contactPersonContact: { type: String, required: true },
    status: {
      type: String,
      enum: ['no_match', 'pending_claim', 'claim_approved', 'under_approval'],
      required: true,
      default: 'no_match',
    },
    type: { type: String, enum: ['lost', 'found'], required: true },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    descriptors: { type: [[Number]], required: true }, // 2D array of numbers
  },
  { timestamps: true },
);

export default mongoose.model<IItem>('Item', ItemSchema);
