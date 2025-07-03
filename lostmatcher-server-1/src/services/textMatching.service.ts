import axios from "axios";
import logging from "../config/logging.config";

export interface TextComparisonResult {
	similarity: number;
	isMatch: boolean;
}

export class TextMatchingService {
	private static readonly TEXT_MODEL_URL =
		process.env.TEXT_MATCHING_SERVICE_URL || "http://localhost:8000";
	private static readonly DEFAULT_TEXT_THRESHOLD = 0.7; // 70% similarity threshold
	private static readonly CONNECTION_TIMEOUT = 10000; // 10 seconds

	/**
	 * Check if the text matching service is available
	 */
	static async isServiceAvailable(): Promise<boolean> {
		try {
			const response = await axios.get(`${this.TEXT_MODEL_URL}/health`, {
				timeout: this.CONNECTION_TIMEOUT,
			});
			return response.status === 200;
		} catch (error) {
			logging.warn("Text matching service is not available:", error);
			return false;
		}
	}

	/**
	 * Compare two text descriptions using the text matching model
	 */
	static async compareTexts(
		description1: string,
		description2: string,
		threshold: number = this.DEFAULT_TEXT_THRESHOLD
	): Promise<TextComparisonResult> {
		try {
			// Check if service is available
			if (!(await this.isServiceAvailable())) {
				logging.warn(
					"Text matching service unavailable, falling back to basic comparison"
				);
				return this.fallbackTextComparison(
					description1,
					description2,
					threshold
				);
			}

			const response = await axios.post(
				`${this.TEXT_MODEL_URL}/compare_items`,
				{
					description1: description1.trim(),
					description2: description2.trim(),
				},
				{
					timeout: this.CONNECTION_TIMEOUT,
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			const similarity = (response.data as { similarity: number })
				.similarity;
			const isMatch = similarity >= threshold;

			logging.info(
				`Text comparison result: ${similarity.toFixed(
					3
				)} (threshold: ${threshold}, match: ${isMatch})`
			);

			return {
				similarity,
				isMatch,
			};
		} catch (error) {
			logging.error("Error in text matching service:", error);
			// Fallback to basic comparison
			return this.fallbackTextComparison(
				description1,
				description2,
				threshold
			);
		}
	}

	/**
	 * Fallback text comparison using basic string similarity
	 */
	private static fallbackTextComparison(
		text1: string,
		text2: string,
		threshold: number
	): TextComparisonResult {
		try {
			const similarity = this.calculateBasicSimilarity(text1, text2);
			const isMatch = similarity >= threshold;

			logging.info(
				`Fallback text comparison: ${similarity.toFixed(
					3
				)} (threshold: ${threshold}, match: ${isMatch})`
			);

			return {
				similarity,
				isMatch,
			};
		} catch (error) {
			logging.error("Error in fallback text comparison:", error);
			return {
				similarity: 0,
				isMatch: false,
			};
		}
	}

	/**
	 * Calculate basic text similarity using Jaccard index
	 */
	private static calculateBasicSimilarity(
		text1: string,
		text2: string
	): number {
		if (!text1 || !text2) return 0;

		// Normalize and tokenize
		const tokens1 = new Set(
			text1
				.toLowerCase()
				.replace(/[^\w\s]/g, "")
				.split(/\s+/)
				.filter((word) => word.length > 2)
		);
		const tokens2 = new Set(
			text2
				.toLowerCase()
				.replace(/[^\w\s]/g, "")
				.split(/\s+/)
				.filter((word) => word.length > 2)
		);

		// Calculate Jaccard similarity
		const intersection = new Set(
			[...tokens1].filter((token) => tokens2.has(token))
		);
		const union = new Set([...tokens1, ...tokens2]);

		if (union.size === 0) return 0;
		return intersection.size / union.size;
	}

	/**
	 * Batch compare multiple text descriptions
	 */
	static async batchCompareTexts(
		sourceText: string,
		targetTexts: string[],
		threshold: number = this.DEFAULT_TEXT_THRESHOLD
	): Promise<TextComparisonResult[]> {
		const results: TextComparisonResult[] = [];

		for (const targetText of targetTexts) {
			const result = await this.compareTexts(
				sourceText,
				targetText,
				threshold
			);
			results.push(result);
		}

		return results;
	}

	/**
	 * Get text similarity threshold based on user preference
	 */
	static getTextThreshold(userThreshold?: number): number {
		if (userThreshold && userThreshold > 0 && userThreshold <= 1) {
			return userThreshold;
		}
		return this.DEFAULT_TEXT_THRESHOLD;
	}

	/**
	 * Initialize the text matching service
	 */
	static async initialize(): Promise<void> {
		try {
			const isAvailable = await this.isServiceAvailable();
			if (isAvailable) {
				logging.info(
					`Text matching service initialized successfully at ${this.TEXT_MODEL_URL}`
				);
			} else {
				logging.warn(
					`Text matching service not available at ${this.TEXT_MODEL_URL}. Using fallback text comparison.`
				);
				logging.info(
					"To start the text matching service, run: npm run start:text-model"
				);
			}
		} catch (error) {
			logging.error("Failed to initialize text matching service:", error);
		}
	}
}
