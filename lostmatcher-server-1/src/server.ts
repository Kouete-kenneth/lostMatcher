import { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app";
import config from "./config/env.config";
import logger from "./config/logging.config";
import { RealTimeNotificationService } from "./services/realTimeNotification.service";
import { PeriodicSearchService } from "./services/periodicSearch.service";
import { MatchNotificationService } from "./services/matchNotification.service";
import { TextMatchingService } from "./services/textMatching.service";
// import { socketService } from './services/socket.services.js';

let httpServer: ReturnType<typeof createServer>;

// Function to connect to MongoDB and initialize the server and socket.io
const setupServer = async () => {
	try {
		await mongoose.connect(config.mongoose.url, config.mongoose.options);
		logger.log("-----------------------------------------");
		logger.info(
			`Connected to Atlas MongoDB database: ${config.mongoose.options.dbName}`
		);
		logger.log("-----------------------------------------");

		// Basic error handling middleware
		app.use(
			(error: any, req: Request, res: Response, next: NextFunction) => {
				logger.error(error);
				res.status(500).json({
					message: "Internal Server Error",
					error,
				});
			}
		);

		// Create the HTTP server and attach the Express app
		httpServer = createServer(app);

		// Initialize real-time notification service with Socket.io
		RealTimeNotificationService.initialize(httpServer);

		// Initialize notification services
		await MatchNotificationService.initialize();

		// Initialize text matching service
		await TextMatchingService.initialize();

		// Start periodic search service (runs every 6 hours by default)
		PeriodicSearchService.start();

		// Initialize socket service
		// socketService.initialize(io);

		// Start the HTTP server
		httpServer.listen(config.port, () => {
			logger.log("-----------------------------------------");
			logger.info(
				`Server and Socket.io listening on port ${config.port}`
			);
			logger.log("-----------------------------------------");
		});
	} catch (error) {
		logger.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

// Function to disconnect and reconnect to the database if needed
const startServer = async () => {
	try {
		if (mongoose.connection.readyState === 1) {
			logger.info("Disconnecting the existing MongoDB connection...");
			await mongoose.disconnect();
		}
		await setupServer();
	} catch (error) {
		logger.error("Error reconnecting to MongoDB:", error);
	}
};

// Graceful shutdown handlers
const exitHandler = () => {
	if (httpServer) {
		httpServer.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	exitHandler();
});

process.on("unhandledRejection", (error) => {
	logger.error("Unhandled Rejection:", error);
	exitHandler();
});

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (httpServer) {
		httpServer.close();
	}
});

// Export socket service functions for use in other parts of the application
// TODO: Remove this: and use socketService directly by importing it from /services/socket.service.js
// export const emitNotification = socketService.emitNotification.bind(socketService);
// export const broadcastReactionUpdate = socketService.broadcastReactionUpdate.bind(socketService);
// export const broadcastCommentUpdate = socketService.broadcastCommentUpdate.bind(socketService);
// export const broadcastFollowUpdate = socketService.broadcastFollowUpdate.bind(socketService);

// Initialize the server
startServer();
