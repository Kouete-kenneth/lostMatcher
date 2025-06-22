import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { roleRights } from "../config/roles.config";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

type VerifyCallback = (
	req: Request,
	resolve: () => void,
	reject: (error: ApiError) => void,
	requiredRights: string[]
) => (err: any, user: any, info: any) => Promise<void>;

// Verifies if the user has the necessary rights
const verifyCallback: VerifyCallback =
	(req, resolve, reject, requiredRights) => async (err, user, info) => {
		if (err || info || !user) {
			return reject(
				new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
			);
		}
		req.user = user;

		if (requiredRights.length) {
			const userRights = roleRights.get(user.role) || [];
			const hasRequiredRights = requiredRights.every((requiredRight) =>
				userRights.includes(requiredRight)
			);
			if (!hasRequiredRights && !user.id) {
				return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
			}
		}

		resolve();
	};

// Auth middleware for route protection
const auth =
	(...requiredRights: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		return new Promise<void>((resolve, reject) => {
			passport.authenticate(
				"jwt",
				{ session: false },
				verifyCallback(req, resolve, reject, requiredRights)
			)(req, res, next);
		})
			.then(() => next())
			.catch((err) => next(err));
	};

// Rate limiter to control authentication attempts
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // limit each IP to 20 requests per windowMs
	skipSuccessfulRequests: true,
});

export { auth, authLimiter };
