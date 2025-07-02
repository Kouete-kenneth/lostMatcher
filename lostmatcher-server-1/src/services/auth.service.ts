import httpStatus from "http-status";
import * as tokenService from "./token.service";
import * as userService from "./user.service";
import Token, { IToken } from "../models/token.model";
import ApiError from "../utils/ApiError";
import { tokenTypes } from "../config/tokens.config";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

/**
 * Login with username and password
 * @param email - User email
 * @param password - User password
 * @returns The authenticated user
 * @throws ApiError if authentication fails
 */
const loginUserWithEmailAndPassword = async (
	email: string,
	password: string
): Promise<IUser> => {
	const user = await userService.getUserByEmail(email);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Incorrect email or password"
		);
	}

	// Check if email is verified
	if (!user.isEmailVerified) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Please verify your email address before logging in"
		);
	}

	return user;
};

/**
 * Logout by invalidating the refresh token
 * @param refreshToken - The refresh token to invalidate
 * @returns Promise<void>
 * @throws ApiError if token not found
 */
const logout = async (refreshToken: string): Promise<void> => {
	const refreshTokenDoc = await Token.findOne({
		token: refreshToken,
		type: tokenTypes.REFRESH,
		blacklisted: false,
	});
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
	}
	await Token.deleteOne({ _id: refreshTokenDoc._id });
};

/**
 * Refresh authentication tokens using a valid refresh token
 * @param refreshToken - The refresh token
 * @returns New authentication tokens
 * @throws ApiError if refresh fails
 */
const refreshAuth = async (
	refreshToken: string
): Promise<ReturnType<typeof tokenService.generateAuthTokens>> => {
	const refreshTokenDoc = (await tokenService.verifyToken(
		refreshToken,
		tokenTypes.REFRESH
	)) as IToken;
	const user = await userService.getUserById(refreshTokenDoc.user.toString());
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	await Token.deleteOne({ _id: refreshTokenDoc._id });
	return tokenService.generateAuthTokens(user);
};

/**
 * Reset user password using a reset token
 * @param resetPasswordToken - The reset password token
 * @param newPassword - The new password
 * @returns Promise<void>
 * @throws ApiError if reset fails
 */
const resetPassword = async (
	resetPasswordToken: string,
	newPassword: string
): Promise<void> => {
	try {
		const resetPasswordTokenDoc = (await tokenService.verifyToken(
			resetPasswordToken,
			tokenTypes.RESET_PASSWORD
		)) as IToken;
		const user = await userService.getUserById(
			resetPasswordTokenDoc.user.toString()
		);
		if (!user) {
			throw new ApiError(httpStatus.NOT_FOUND, "User not found");
		}
		await userService.updateUserById(user.id, { password: newPassword });
		await Token.deleteMany({
			user: user.id,
			type: tokenTypes.RESET_PASSWORD,
		});
	} catch (error: any) {
		console.error(
			"An error occurred during password reset:",
			error.message
		);
		if (error instanceof ApiError) {
			throw error;
		} else {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				"Password reset failed"
			);
		}
	}
};

/**
 * Generate and save email verification code
 * @param user - The user to generate code for
 * @returns The 6-digit verification code
 */
const generateEmailVerificationCode = async (user: IUser): Promise<string> => {
	// Generate 6-digit code
	const code = Math.floor(100000 + Math.random() * 900000).toString();

	// Set expiration to 15 minutes from now
	const expires = new Date();
	expires.setMinutes(expires.getMinutes() + 15);

	// Save code and expiration to user
	await userService.updateUserById(user.id, {
		emailVerificationCode: code,
		emailVerificationExpires: expires,
	});

	return code;
};

/**
 * Verify user email using a verification code
 * @param email - User email
 * @param code - The 6-digit verification code
 * @returns Promise<void>
 * @throws ApiError if verification fails
 */
const verifyEmailWithCode = async (
	email: string,
	code: string
): Promise<void> => {
	const user = await userService.getUserByEmail(email);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if (!user.emailVerificationCode || !user.emailVerificationExpires) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"No verification code found. Please request a new one."
		);
	}

	if (new Date() > user.emailVerificationExpires) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Verification code has expired. Please request a new one."
		);
	}

	if (user.emailVerificationCode !== code) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Invalid verification code");
	}

	// Verify the email and clear verification fields
	await userService.updateUserById(user.id, {
		isEmailVerified: true,
		emailVerificationCode: undefined,
		emailVerificationExpires: undefined,
	});
};

/**
 * Verify user email using a verification token (legacy support)
 * @param verifyEmailToken - The email verification token
 * @returns Promise<void>
 * @throws ApiError if verification fails
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
	try {
		const verifyEmailTokenDoc = (await tokenService.verifyToken(
			verifyEmailToken,
			tokenTypes.VERIFY_EMAIL
		)) as IToken;
		const user = await userService.getUserById(
			verifyEmailTokenDoc.user.toString()
		);

		if (!user) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User Not Found");
		}

		await Token.deleteMany({
			user: user.id,
			type: tokenTypes.VERIFY_EMAIL,
		});
		await userService.updateUserById(user.id, { isEmailVerified: true });
	} catch (error) {
		console.log(error);
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Email verification failed"
		);
	}
};

/**
 * Decodes the provided token and extracts the user ID.
 * @param token - The token to decode
 * @param tokenType - The type of the token (e.g., access, refresh)
 * @returns The decoded user ID
 * @throws ApiError if the token is invalid or expired
 */
const getUserIdFromToken = async (
	token: string,
	tokenType: string
): Promise<string> => {
	const tokenDoc = (await tokenService.verifyToken(
		token,
		tokenType
	)) as IToken;
	const userId = tokenDoc.user;
	return userId.toString();
};

export {
	loginUserWithEmailAndPassword,
	logout,
	refreshAuth,
	resetPassword,
	verifyEmail,
	generateEmailVerificationCode,
	verifyEmailWithCode,
	getUserIdFromToken,
};
