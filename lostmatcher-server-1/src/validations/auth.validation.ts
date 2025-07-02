import Joi from "joi";
import { password } from "./custom.validation";
import { use } from "passport";

const register = {
	body: Joi.object({
		username: Joi.string().required(),
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const refreshTokens = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};

const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

const resetPassword = {
	query: Joi.object().keys({
		token: Joi.string().required(),
	}),
	body: Joi.object().keys({
		password: Joi.string()
			.required()
			.custom(password, "Password validation")
			.messages({
				"any.required": "Password is required",
				"string.empty": "Password cannot be empty",
				custom: "Password does not meet requirements",
			}),
		email: Joi.string().required(),
	}),
};

const verifyEmail = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
		code: Joi.string().length(6).pattern(/^\d+$/).required(),
	}),
};

const TokenUserId = {
	body: Joi.object().keys({
		token: Joi.string().required(),
		tokenType: Joi.string()
			.valid("access", "refresh", "resetPassword", "verifyEmail")
			.required(),
	}),
};

const sendVerificationCode = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

export {
	register,
	login,
	logout,
	refreshTokens,
	forgotPassword,
	resetPassword,
	verifyEmail,
	sendVerificationCode,
	TokenUserId,
};
