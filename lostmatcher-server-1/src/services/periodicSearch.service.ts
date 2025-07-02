import cron from "node-cron";
import logging from "../config/logging.config";
import User from "../models/user.model";
import { LostReport } from "../models/lostReport.model";
import { FoundReport } from "../models/foundReport.model";
import { MatchingService } from "./matching.service";
import { MatchNotificationService } from "./matchNotification.service";

export class PeriodicSearchService {
	private static isRunning = false;
	private static cronJob: cron.ScheduledTask | null = null;

	/**
	 * Start the periodic search service
	 * Runs every 6 hours by default
	 */
	static start(cronExpression: string = "0 */6 * * *"): void {
		if (this.isRunning) {
			logging.warn("Periodic search service is already running");
			return;
		}

		this.cronJob = cron.schedule(
			cronExpression,
			async () => {
				await this.runPeriodicSearch();
			},
			{
				scheduled: false,
				timezone: "UTC",
			}
		);

		this.cronJob.start();
        this.isRunning = true;
        logging.log("-----------------------------------------");
		logging.info(
			`Periodic search service started with schedule: ${cronExpression}`
        );
        logging.log('-----------------------------------------');
	}

	/**
	 * Stop the periodic search service
	 */
	static stop(): void {
		if (this.cronJob) {
			this.cronJob.stop();
			this.cronJob = null;
		}
		this.isRunning = false;
		logging.info("Periodic search service stopped");
	}

	/**
	 * Run a single periodic search cycle
	 */
	static async runPeriodicSearch(): Promise<void> {
		try {
			logging.info("Starting periodic search cycle");

			// Get all users who have enabled periodic search
			const usersWithPeriodicSearch = await User.find({
				periodicSearchEnabled: true,
				accountStatus: "active",
			});

			logging.info(
				`Found ${usersWithPeriodicSearch.length} users with periodic search enabled`
			);
			for (const user of usersWithPeriodicSearch) {
				await this.runSearchForUser((user._id as any).toString());
			}

			logging.info("Periodic search cycle completed");
		} catch (error) {
			logging.error("Error during periodic search cycle:", error);
		}
	}

	/**
	 * Run periodic search for a specific user
	 */
	static async runSearchForUser(userId: string): Promise<void> {
		try {
			logging.info(`Running periodic search for user ${userId}`);

			// Get user's active lost reports
			const userLostReports = await LostReport.find({
				reporter: userId,
				status: { $ne: "resolved" },
			});

			// Get user's active found reports
			const userFoundReports = await FoundReport.find({
				finder: userId,
				status: { $ne: "resolved" },
			});

			// Re-run matching for each lost report
			for (const lostReport of userLostReports) {
				try {
					await MatchingService.findMatchesForLostReport(
						(lostReport._id as any).toString()
					);
					// Note: The matching service will automatically send notifications if new matches are found
				} catch (error) {
					logging.error(
						`Failed to run matching for lost report ${lostReport._id}:`,
						error
					);
				}
			}

			// Re-run matching for each found report
			for (const foundReport of userFoundReports) {
				try {
					await MatchingService.findMatchesForFoundReport(
						(foundReport._id as any).toString()
					);
					// Note: The matching service will automatically send notifications if new matches are found
				} catch (error) {
					logging.error(
						`Failed to run matching for found report ${foundReport._id}:`,
						error
					);
				}
			}

			logging.info(`Completed periodic search for user ${userId}`);
		} catch (error) {
			logging.error(
				`Error during periodic search for user ${userId}:`,
				error
			);
		}
	}

	/**
	 * Run periodic search for a specific report (can be called manually)
	 */
	static async runSearchForReport(
		reportId: string,
		reportType: "lost" | "found"
	): Promise<void> {
		try {
			logging.info(
				`Running manual periodic search for ${reportType} report ${reportId}`
			);

			if (reportType === "lost") {
				await MatchingService.findMatchesForLostReport(reportId);
			} else {
				await MatchingService.findMatchesForFoundReport(reportId);
			}

			logging.info(
				`Completed manual periodic search for ${reportType} report ${reportId}`
			);
		} catch (error) {
			logging.error(
				`Error during manual periodic search for ${reportType} report ${reportId}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Check if the service is running
	 */
	static isServiceRunning(): boolean {
		return this.isRunning;
	}

	/**
	 * Get the next scheduled run time
	 */
	static getNextRunTime(): Date | null {
		if (this.cronJob) {
			// Return null for now since nextDates is not available in this version
			// TODO: Implement proper next run time calculation
			return null;
		}
		return null;
	}
}
