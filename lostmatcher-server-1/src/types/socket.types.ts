import { Types } from 'mongoose';

export interface SocketUser {
    userId: string;
    socketId: string;
}

export interface ReactionEvent {
    type: string;
    user_id: Types.ObjectId;
    article_id?: Types.ObjectId;
    comment_id?: Types.ObjectId;
    createdAt: Date;
}

export interface CommentEvent {
    _id: Types.ObjectId;
    content: string;
    author_id: Types.ObjectId;
    article_id: Types.ObjectId;
    parent_comment_id?: Types.ObjectId;
    createdAt: Date;
}

export interface FollowEvent {
    follower_id: Types.ObjectId;
    followed_id: Types.ObjectId;
    createdAt: Date;
}

export interface NotificationEvent {
    type: string;
    category: string;
    sender_id: Types.ObjectId | null;
    sender_name?: string;
    receivers_id: Types.ObjectId[];
    content: string;
    article_id?: Types.ObjectId;
    slug?: string | null;
    isArticle?: boolean;
    comment_id?: Types.ObjectId;
    createdAt: Date;
}
