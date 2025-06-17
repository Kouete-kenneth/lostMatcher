import { Types } from 'mongoose';
import { Server } from 'socket.io';
import logger from '../config/logging.config';
import { CommentEvent, FollowEvent, NotificationEvent, ReactionEvent } from '../types/socket.types';

class SocketService {
    private io: Server | null = null;
    private userSocketMap: Map<string, string> = new Map();

    initialize(io: Server) {
        this.io = io;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.io) return;

        this.io.on('connection', (socket) => {
            logger.info('New client connected:', socket.id);

            socket.on('join', (userId: string) => {
                this.handleUserJoin(userId, socket.id);
            });

            socket.on('disconnect', () => {
                this.handleUserDisconnect(socket.id);
            });
        });
    }

    private handleUserJoin(userId: string, socketId: string) {
        this.userSocketMap.set(userId, socketId);
        logger.info(`User ${userId} joined with socket ID ${socketId}`);
    }

    private handleUserDisconnect(socketId: string) {
        for (const [userId, sId] of this.userSocketMap.entries()) {
            if (sId === socketId) {
                this.userSocketMap.delete(userId);
                logger.info(`User ${userId} disconnected`);
                break;
            }
        }
    }

    emitNotification(userId: string | Types.ObjectId, notification: NotificationEvent) {
        const userIdStr = userId.toString();
        const socketId = this.userSocketMap.get(userIdStr);

        if (socketId && this.io) {
            this.io.to(socketId).emit('notification', notification);
            logger.info(`Notification sent to user ${userIdStr}`);
        } else {
            logger.warn(`Could not send notification to user ${userIdStr} - socket not found`);
        }
    }

    // broadcastReactionUpdate(reaction: IReaction) {
    //     if (this.io) {
    //         this.io.emit('reactionUpdate', reaction);
    //         logger.info('Reaction update broadcasted to all users');
    //     } else {
    //         logger.warn('Could not broadcast reaction update - io not initialized');
    //     }
    // }

    // broadcastCommentUpdate(comment: IComment) {
    //     if (this.io) {
    //         this.io.emit('commentUpdate', comment);
    //         logger.info('Comment update broadcasted to all users');
    //     } else {
    //         logger.warn('Could not broadcast comment update - io not initialized');
    //     }
    // }

    broadcastFollowUpdate(follow: FollowEvent) {
        if (this.io) {
            this.io.emit('followUpdate', follow);
            logger.info('Follow update broadcasted to all users');
        } else {
            logger.warn('Could not broadcast follow update - io not initialized');
        }
    }

    getSocketId(userId: string): string | undefined {
        return this.userSocketMap.get(userId);
    }

    getUserSocketMap(): Map<string, string> {
        return this.userSocketMap;
    }
}

export const socketService = new SocketService();
