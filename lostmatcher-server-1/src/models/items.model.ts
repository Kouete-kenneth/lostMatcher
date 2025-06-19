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
  status: 'no match' | 'pending claim' | 'claim approved' | 'further verification required';
  type: 'lost' | 'found';
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
      enum: ['no match', 'pending claim', 'claim approved', 'further verification required'],
      required: true,
      default: 'no match',
    },
    type: { type: String, enum: ['lost', 'found'], required: true },
    date: { type: Date, required: true },
    userId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IItem>('Item', ItemSchema);
