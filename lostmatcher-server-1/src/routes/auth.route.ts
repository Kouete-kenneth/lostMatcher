import express from 'express';
import { register, login, logout, refreshTokens, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail, getTokenUserId } from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import { register as registerValidation, login as loginValidation, logout as logoutValidation, refreshTokens as refreshTokensValidation, forgotPassword as forgotPasswordValidation, resetPassword as resetPasswordValidation, verifyEmail as verifyEmailValidation, TokenUserId as TokenUserIdValidation } from '../validations/auth.validation';
import { auth } from '../middlewares/auth';

const AuthRoutes = express.Router();

AuthRoutes.post('/register', validate(registerValidation), register);
AuthRoutes.post('/login', validate(loginValidation), login);
AuthRoutes.post('/logout', validate(logoutValidation), logout);
AuthRoutes.post('/refresh-tokens', auth(), validate(refreshTokensValidation), refreshTokens);
AuthRoutes.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);
AuthRoutes.post('/reset-password', validate(resetPasswordValidation), resetPassword);
AuthRoutes.post('/send-verification-email', auth(), sendVerificationEmail);
AuthRoutes.post('/verify-email', validate(verifyEmailValidation), verifyEmail);
AuthRoutes.post('/token/userId', auth(), validate(TokenUserIdValidation), getTokenUserId);

export default AuthRoutes;
