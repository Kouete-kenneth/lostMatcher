import nodemailer from "nodemailer";
import logging from "../config/logging.config";
import { IUser } from "../models/user.model";
import { MatchCandidate } from "./matching.service";
import { createNotification } from "./notification.service";
import { RealTimeNotificationService } from "./realTimeNotification.service";

export interface MatchNotificationData {
	user: IUser;
	lostReportId: string;
	matches: MatchCandidate[];
	reportType: "lost" | "found";
}

export class MatchNotificationService {
	private static transporter: nodemailer.Transporter;
	private static emailServiceEnabled = false;

	static async initialize() {
		// Check if email credentials are provided
		if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
			logging.warn(
				"Email service disabled: SMTP credentials not provided"
			);
			logging.info(
				"To enable email notifications, set SMTP_USERNAME and SMTP_PASSWORD environment variables"
			);
			this.emailServiceEnabled = false;
			return;
		}

		// Get SMTP configuration from environment
		const smtpPort = parseInt(process.env.SMTP_PORT || "587");
		const isSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

		// Initialize email transporter
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || "smtp.gmail.com",
			port: smtpPort,
			secure: isSecure, // true for 465, false for other ports
			service: process.env.SMTP_SERVICE || undefined, // Use 'gmail' if specified
			auth: {
				user: process.env.SMTP_USERNAME,
				pass: process.env.SMTP_PASSWORD,
			},
			// Add additional options for better compatibility
			tls: {
				rejectUnauthorized: false,
			},
		});

		// Verify connection
		try {
			await this.transporter.verify();
			this.emailServiceEnabled = true;
			logging.info(
				"Match notification email service initialized successfully"
			);
		} catch (error) {
			this.emailServiceEnabled = false;
			logging.error(
				"Failed to initialize match notification email service:",
				error
			);
			logging.warn(
				"Email notifications will be disabled. In-app and real-time notifications will still work."
			);
			logging.info(
				"For Gmail, ensure you're using an App Password: https://support.google.com/accounts/answer/185833"
			);
		}
	}

	/**
	 * Send email notification for potential matches
	 */
	static async sendMatchNotificationEmail(
		data: MatchNotificationData
	): Promise<void> {
		try {
			// Check if email service is enabled
			if (!this.emailServiceEnabled) {
				logging.info(
					"Email service disabled, skipping email notification"
				);
				return;
			}

			// Check if user wants match alerts
			if (!data.user.notificationPreferences?.matchAlerts) {
				logging.info(
					`User ${data.user.email} has disabled match alerts`
				);
				return;
			}

			const subject = `🎯 Potential matches found for your ${data.reportType} report!`;
			const htmlContent = this.generateMatchEmailTemplate(data);

			const mailOptions = {
				from:
					process.env.EMAIL_FROM ||
					process.env.SMTP_FROM_EMAIL ||
					"noreply@lostmatcher.com",
				to: data.user.email,
				subject,
				html: htmlContent,
			};

			await this.transporter.sendMail(mailOptions);
			logging.info(`Match notification email sent to ${data.user.email}`);
		} catch (error) {
			logging.error("Failed to send match notification email:", error);
		}
	}

	/**
	 * Generate HTML email template for match notifications
	 */
	private static generateMatchEmailTemplate(
		data: MatchNotificationData
	): string {
		const { user, matches, reportType, lostReportId } = data;
		const matchCount = matches.length;
		const topMatch = matches[0];

		return `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<title>Potential Matches Found</title>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
					.content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
					.match-item { background: white; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #4CAF50; }
					.similarity-score { font-weight: bold; color: #4CAF50; }
					.cta-button { background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
					.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🎯 Great News!</h1>
						<p>We found ${matchCount} potential match${
			matchCount > 1 ? "es" : ""
		} for your ${reportType} report</p>
					</div>
					<div class="content">
						<p>Hello ${user.name || user.username},</p>
						<p>Our matching system has identified ${matchCount} potential match${
			matchCount > 1 ? "es" : ""
		} for your ${reportType} report. Here are the details:</p>
						
						${matches
							.map(
								(match, index) => `
							<div class="match-item">
								<h3>Match #${index + 1}</h3>
								<p><span class="similarity-score">Similarity: ${Math.round(
									match.similarity_score * 100
								)}%</span></p>
								<p><strong>Confidence:</strong> ${Math.round(match.confidence * 100)}%</p>
								<p><strong>Type:</strong> ${match.type} report</p>
								<p><strong>Matches found:</strong> ${match.matches_count} feature points</p>
							</div>
						`
							)
							.join("")}
						
						<p>The best match shows a <span class="similarity-score">${Math.round(
							topMatch.similarity_score * 100
						)}% similarity</span> with your report.</p>
						
						<a href="${
							process.env.FRONTEND_URL || "http://localhost:3000"
						}/matches/${lostReportId}" class="cta-button">
							View All Matches
						</a>
						
						<p><strong>What's next?</strong></p>
						<ul>
							<li>Review the matches in your dashboard</li>
							<li>Contact the person who reported the matching item</li>
							<li>Verify if it's actually your item</li>
							<li>Update the match status once confirmed</li>
						</ul>
						
						<p>Good luck with recovering your item!</p>
					</div>
					<div class="footer">
						<p>You're receiving this because you enabled match alerts in your notification preferences.</p>
						<p>To unsubscribe, <a href="${
							process.env.FRONTEND_URL || "http://localhost:3000"
						}/settings">update your preferences</a></p>
					</div>
				</div>
			</body>
			</html>
		`;
	}

	/**
	 * Create in-app notification for matches
	 */
	static async createInAppMatchNotification(
		data: MatchNotificationData
	): Promise<void> {
		try {
			const { user, matches, reportType, lostReportId } = data;
			const matchCount = matches.length;
			const topSimilarity = Math.round(
				matches[0]?.similarity_score * 100 || 0
			);

			const notificationBody = {
				recipients: [user._id], // Use 'recipients' array as required by model
				title: `🎯 ${matchCount} potential match${
					matchCount > 1 ? "es" : ""
				} found!`,
				content: `We found ${matchCount} potential match${
					matchCount > 1 ? "es" : ""
				} for your ${reportType} report. Best match: ${topSimilarity}% similarity.`, // Use 'content' instead of 'message'
				type: "match", // Use valid enum value from NotificationType
				link: `/matches/${lostReportId}`, // Use 'link' instead of 'actionUrl'
				// Remove fields not in the model schema
			};

			await createNotification(notificationBody);
			logging.info(`In-app notification created for user ${user._id}`);
		} catch (error) {
			logging.error("Failed to create in-app notification:", error);
		}
	}

	/**
	 * Send real-time notification (WebSocket/Socket.IO)
	 */
	static async sendRealTimeMatchNotification(
		data: MatchNotificationData
	): Promise<void> {
		try {
			// Send real-time notification using the WebSocket service
			await RealTimeNotificationService.sendMatchNotification(
				(data.user._id as any).toString(),
				{
					reportId: data.lostReportId,
					reportType: data.reportType,
					matchCount: data.matches.length,
					topMatchScore: data.matches[0]?.similarity_score || 0,
				}
			);

			logging.info(
				`Real-time match notification sent to user ${data.user._id}`
			);
		} catch (error) {
			logging.error("Failed to send real-time notification:", error);
		}
	}

	/**
	 * Send all types of notifications for matches
	 */
	static async sendMatchNotifications(
		data: MatchNotificationData
	): Promise<void> {
		await Promise.allSettled([
			this.sendMatchNotificationEmail(data),
			this.createInAppMatchNotification(data),
			this.sendRealTimeMatchNotification(data),
		]);
	}
}
