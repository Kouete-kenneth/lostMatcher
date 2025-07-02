import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import logging from "../config/logging.config";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export interface SocketUser {
	userId: string;
	socketId: string;
}

export interface RealTimeNotification {
	type: "match_found" | "new_message" | "report_update" | "system_alert";
	title: string;
	message: string;
	data?: any;
	timestamp: Date;
}

export class RealTimeNotificationService {
	private static io: Server;
	private static connectedUsers: Map<string, string> = new Map(); // userId -> socketId

	/**
	 * Initialize the WebSocket server
	 */
	static initialize(httpServer: HttpServer): void {
		this.io = new Server(httpServer, {
			cors: {
				origin: process.env.CLIENT_URL || "http://localhost:3000",
				methods: ["GET", "POST"],
				credentials: true,
			},
			transports: ["websocket", "polling"],
		});

		this.setupSocketHandlers();
		logging.info("Real-time notification service initialized");
	}

	/**
	 * Setup socket event handlers
	 */
	private static setupSocketHandlers(): void {
		this.io.on("connection", async (socket) => {
			logging.info(`New socket connection: ${socket.id}`);

			// Handle user authentication
			socket.on("authenticate", async (token: string) => {
				try {
					const decoded = jwt.verify(
						token,
						process.env.JWT_SECRET || "fallback-secret"
					) as any;
					const user = await User.findById(decoded.sub);

					if (user) {
						// Store user-socket mapping
						this.connectedUsers.set(
							(user._id as any).toString(),
							socket.id
						);
						socket.data.userId = (user._id as any).toString();

						// Join user to their personal room
						socket.join(`user:${user._id}`);

						logging.info(
							`User ${user._id} authenticated and connected via socket ${socket.id}`
						);

						// Send authentication success
						socket.emit("authenticated", {
							success: true,
							userId: (user._id as any).toString(),
						});
					} else {
						socket.emit("authentication_error", "Invalid user");
						socket.disconnect();
					}
				} catch (error) {
					logging.error("Socket authentication error:", error);
					socket.emit("authentication_error", "Invalid token");
					socket.disconnect();
				}
			});

			// Handle disconnection
			socket.on("disconnect", () => {
				if (socket.data.userId) {
					this.connectedUsers.delete(socket.data.userId);
					logging.info(`User ${socket.data.userId} disconnected`);
				}
			});

			// Handle ping/pong for connection health
			socket.on("ping", () => {
				socket.emit("pong");
			});
		});
	}

	/**
	 * Send a real-time notification to a specific user
	 */
	static async sendNotificationToUser(
		userId: string,
		notification: RealTimeNotification
	): Promise<void> {
		try {
			// Send to user's personal room
			this.io.to(`user:${userId}`).emit("notification", notification);

			logging.info(
				`Real-time notification sent to user ${userId}: ${notification.type}`
			);
		} catch (error) {
			logging.error(
				`Failed to send real-time notification to user ${userId}:`,
				error
			);
		}
	}

	/**
	 * Send a real-time notification to multiple users
	 */
	static async sendNotificationToUsers(
		userIds: string[],
		notification: RealTimeNotification
	): Promise<void> {
		try {
			for (const userId of userIds) {
				await this.sendNotificationToUser(userId, notification);
			}
		} catch (error) {
			logging.error(
				"Failed to send real-time notifications to multiple users:",
				error
			);
		}
	}

	/**
	 * Send a match notification in real-time
	 */
	static async sendMatchNotification(
		userId: string,
		matchData: {
			reportId: string;
			reportType: "lost" | "found";
			matchCount: number;
			topMatchScore: number;
		}
	): Promise<void> {
		const notification: RealTimeNotification = {
			type: "match_found",
			title: "🎯 New Match Found!",
			message: `We found ${matchData.matchCount} potential match${
				matchData.matchCount > 1 ? "es" : ""
			} for your ${matchData.reportType} report`,
			data: {
				reportId: matchData.reportId,
				reportType: matchData.reportType,
				matchCount: matchData.matchCount,
				topMatchScore: Math.round(matchData.topMatchScore * 100),
			},
			timestamp: new Date(),
		};

		await this.sendNotificationToUser(userId, notification);
	}

	/**
	 * Send a system alert to all connected users
	 */
	static async sendSystemAlert(message: string, data?: any): Promise<void> {
		const notification: RealTimeNotification = {
			type: "system_alert",
			title: "System Alert",
			message,
			data,
			timestamp: new Date(),
		};

		this.io.emit("notification", notification);
		logging.info("System alert sent to all connected users");
	}

	/**
	 * Get the list of connected users
	 */
	static getConnectedUsers(): SocketUser[] {
		return Array.from(this.connectedUsers.entries()).map(
			([userId, socketId]) => ({
				userId,
				socketId,
			})
		);
	}

	/**
	 * Check if a user is connected
	 */
	static isUserConnected(userId: string): boolean {
		return this.connectedUsers.has(userId);
	}

	/**
	 * Get connection statistics
	 */
	static getConnectionStats(): {
		totalConnections: number;
		authenticatedUsers: number;
	} {
		return {
			totalConnections: this.io.sockets.sockets.size,
			authenticatedUsers: this.connectedUsers.size,
		};
	}
}
