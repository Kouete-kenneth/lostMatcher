import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import * as tokenService from "../services/token.service";
import * as emailService from "../services/email.service";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

const register = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = await userService.createUser(req.body);
			const tokens = await tokenService.generateAuthTokens(user);
			// Send verification email with code after registration
			const verificationCode =
				await authService.generateEmailVerificationCode(user);
			await emailService.sendVerificationEmail(
				user.email,
				verificationCode
			);
			res.status(httpStatus.CREATED).send({ user, tokens });
		} catch (error) {
			next(error);
		}
	}
);

const login = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;
			const user = await authService.loginUserWithEmailAndPassword(
				email,
				password
			);
			const tokens = await tokenService.generateAuthTokens(user);
			const session = req.session;
			res.send({ user, tokens, session });
		} catch (error) {
			next(error);
		}
	}
);

const logout = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await authService.logout(req.body.refreshToken);
			res.status(httpStatus.OK).json("logout successful");
		} catch (error) {
			next(error);
		}
	}
);

const refreshTokens = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const tokens = await authService.refreshAuth(req.body.refreshToken);
			res.send({ ...tokens });
		} catch (error) {
			next(error);
		}
	}
);

const forgotPassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const resetPasswordToken =
				await tokenService.generateResetPasswordToken(req.body.email);
			await emailService.sendResetPasswordEmail(
				req.body.email,
				resetPasswordToken
			);
			res.status(httpStatus.OK).send();
		} catch (error) {
			next(error);
		}
	}
);

const resetPassword = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const token = req.query.token;
			if (!token || typeof token !== "string") {
				return res
					.status(httpStatus.BAD_REQUEST)
					.send("Invalid or missing token");
			}
			await authService.resetPassword(token, req.body.password);
			await emailService.sendEmailVerificationConfirmationEmail(
				req.body.email,
				token
			);
			res.status(httpStatus.OK).send("Password resetted successfully");
		} catch (error) {
			next(error);
		}
	}
);

const sendVerificationEmail = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				return res
					.status(httpStatus.UNAUTHORIZED)
					.send("User not authenticated");
			}
			const verificationCode =
				await authService.generateEmailVerificationCode(
					req.user as IUser
				);
			await emailService.sendVerificationEmail(
				(req.user as IUser).email,
				verificationCode
			);
			res.status(httpStatus.OK).send("email sent successfully");
		} catch (err) {
			next(err);
		}
	}
);

const verifyEmail = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, code } = req.body;
			if (!email || !code) {
				return res
					.status(httpStatus.BAD_REQUEST)
					.send("Email and verification code are required");
			}
			await authService.verifyEmailWithCode(email, code);
			res.status(httpStatus.OK).send({
				message: "Email verification successful",
			});
		} catch (error) {
			next(error);
		}
	}
);

const getTokenUserId = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { token, tokenType } = req.body;
		if (!token || !tokenType) {
			return res
				.status(400)
				.json({ error: "Token and tokenType are required" });
		}
		const userId = await authService.getUserIdFromToken(token, tokenType);
		res.status(200).json({ userId });
	}
);

// Add missing endpoints for frontend integration

/**
 * Check if email is already registered
 */
const checkRegistration = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body;
			const isRegistered = await userService.isEmailTaken(email);
			res.status(httpStatus.OK).send({ isRegistered });
		} catch (error) {
			next(error);
		}
	}
);

/**
 * Get current authenticated user
 */
const getMe = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				throw new ApiError(
					httpStatus.UNAUTHORIZED,
					"User not authenticated"
				);
			}
			res.status(httpStatus.OK).send({ user: req.user });
		} catch (error) {
			next(error);
		}
	}
);

/**
 * Mark user onboarding as complete
 */
const completeOnboarding = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				throw new ApiError(
					httpStatus.UNAUTHORIZED,
					"User not authenticated"
				);
			}
			const user = await userService.updateUserById(
				String((req.user as IUser)._id),
				{ onboardingComplete: true }
			);
			res.status(httpStatus.OK).send({ success: true, user });
		} catch (error) {
			next(error);
		}
	}
);

/**
 * Send email verification code (resend functionality)
 */
const sendVerificationCode = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body;
			const user = await userService.getUserByEmail(email);
			if (!user) {
				throw new ApiError(httpStatus.NOT_FOUND, "User not found");
			}

			const verificationCode =
				await authService.generateEmailVerificationCode(user);
			await emailService.sendVerificationEmail(email, verificationCode);

			res.status(httpStatus.OK).send({
				success: true,
				message: "Verification code sent successfully",
			});
		} catch (error) {
			next(error);
		}
	}
);

export {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	sendVerificationEmail,
	verifyEmail,
	getTokenUserId,
	checkRegistration,
	getMe,
	completeOnboarding,
	sendVerificationCode,
};
