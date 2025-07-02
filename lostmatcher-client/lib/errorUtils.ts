/**
 * Utility functions for safe error handling and logging
 * Prevents stack traces and sensitive information from being exposed
 */

export interface SafeError {
	message: string;
	code?: string;
	status?: number;
}

/**
 * Extracts a clean, user-friendly error message from any error object
 * Never exposes stack traces or sensitive information
 */
export function extractErrorMessage(error: any): string {
	if (typeof error === "string") {
		return error;
	}

	if (error && typeof error === "object") {
		// Handle backend error response format: { error: { message: "...", code: 400 } }
		if (error.error && typeof error.error === "object") {
			if (
				error.error.message &&
				typeof error.error.message === "string"
			) {
				let cleanMessage = error.error.message;
				// Remove "ApiError:" prefix if present
				if (cleanMessage.startsWith("ApiError: ")) {
					cleanMessage = cleanMessage.replace("ApiError: ", "");
				}
				// Make sure the message doesn't contain stack traces
				if (
					!cleanMessage.includes(" at ") &&
					!cleanMessage.includes("\n    at ")
				) {
					return cleanMessage;
				}
			}
		}

		// Handle direct error string in error property
		if (error.error && typeof error.error === "string") {
			return error.error;
		}

		// Handle direct message property
		if (error.message && typeof error.message === "string") {
			let cleanMessage = error.message;
			// Remove "ApiError:" prefix if present
			if (cleanMessage.startsWith("ApiError: ")) {
				cleanMessage = cleanMessage.replace("ApiError: ", "");
			}
			// Make sure the message doesn't contain stack traces
			if (
				!cleanMessage.includes(" at ") &&
				!cleanMessage.includes("\n    at ")
			) {
				return cleanMessage;
			}
		}

		// Check for nested data structures
		if (
			error.data &&
			error.data.message &&
			typeof error.data.message === "string"
		) {
			let cleanMessage = error.data.message;
			if (cleanMessage.startsWith("ApiError: ")) {
				cleanMessage = cleanMessage.replace("ApiError: ", "");
			}
			return cleanMessage;
		}

		if (
			error.data &&
			error.data.error &&
			typeof error.data.error === "string"
		) {
			return error.data.error;
		}

		// Check for axios response structure
		if (error.response && error.response.data) {
			return extractErrorMessage(error.response.data);
		}
	}

	return "An unexpected error occurred";
}

/**
 * Creates a clean error object that's safe to send to the frontend
 */
export function createSafeError(error: any): SafeError {
	const message = extractErrorMessage(error);
	const safeError: SafeError = { message };

	// Only include status if it's a valid HTTP status code
	if (
		error &&
		error.status &&
		typeof error.status === "number" &&
		error.status >= 100 &&
		error.status < 600
	) {
		safeError.status = error.status;
	}

	// Only include code if it's a string and looks like an error code
	if (
		error &&
		error.code &&
		typeof error.code === "string" &&
		error.code.length < 50
	) {
		safeError.code = error.code;
	}

	return safeError;
}

/**
 * Safe logging function that only logs error messages, never full error objects or stack traces
 * Use this instead of console.error for production code
 */
export function logError(context: string, error: any): void {
	const message = extractErrorMessage(error);
	console.warn(`${context}: ${message}`);
}

/**
 * Checks if an error message is safe to display to users
 * Returns false if the message contains technical details or stack traces
 */
export function isUserFriendlyMessage(message: string): boolean {
	if (!message || typeof message !== "string") {
		return false;
	}

	// Check for technical terms that shouldn't be shown to users
	const technicalPatterns = [
		"at ",
		"Error:",
		"stack",
		"trace",
		"function",
		"undefined",
		"null",
		"NaN",
		"TypeError",
		"ReferenceError",
		"SyntaxError",
		"{}",
		"[object Object]",
	];

	return !technicalPatterns.some((pattern) => message.includes(pattern));
}

/**
 * Returns a user-friendly error message, falling back to a generic message if needed
 */
export function getUserFriendlyMessage(
	error: any,
	fallback = "Something went wrong. Please try again."
): string {
	const message = extractErrorMessage(error);
	return isUserFriendlyMessage(message) ? message : fallback;
}
