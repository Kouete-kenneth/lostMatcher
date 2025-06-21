import express from 'express';
import { register, login, logout, refreshTokens, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail, getTokenUserId } from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import { register as registerValidation, login as loginValidation, logout as logoutValidation, refreshTokens as refreshTokensValidation, forgotPassword as forgotPasswordValidation, resetPassword as resetPasswordValidation, verifyEmail as verifyEmailValidation, TokenUserId as TokenUserIdValidation } from '../validations/auth.validation';
import { auth } from '../middlewares/auth';

const AuthRoutes = express.Router();

AuthRoutes.post('/register', validate({ body: registerValidation }), register);
AuthRoutes.post('/login', validate({ body: loginValidation }), login);
AuthRoutes.post('/logout', validate({ body: logoutValidation }), logout);
AuthRoutes.post('/refresh-tokens', validate({ body: refreshTokensValidation }), refreshTokens);
AuthRoutes.post('/forgot-password', validate({ body: forgotPasswordValidation }), forgotPassword);
AuthRoutes.post('/reset-password', validate({ body: resetPasswordValidation }), resetPassword);
AuthRoutes.post('/send-verification-email', auth(), sendVerificationEmail);
AuthRoutes.post('/verify-email', validate({ body: verifyEmailValidation }), verifyEmail);
AuthRoutes.post('/token/userId', auth(), validate({ body: TokenUserIdValidation }), getTokenUserId);

export default AuthRoutes;
