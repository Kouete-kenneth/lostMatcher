import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  status: 'read' | 'unread';
  title: string;
  linkText?: string;
  recipientType: 'user' | 'chosen' | 'everyone';
  recipients?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    linkText: {
      type: String,
      trim: true,
    },
    recipientType: {
      type: String,
      enum: ['user', 'chosen', 'everyone'],
      required: true,
      default: 'user',
    },
    recipients: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
