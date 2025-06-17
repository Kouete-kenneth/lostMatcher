import mongoose from 'mongoose';
import config from '../config/env.config';
import logger from '../config/logging.config';
import ApiError from '../utils/ApiError';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { error } from 'console';

/**
 * Converts non-ApiError instances to ApiError instances.
 * If an error does not extend ApiError, it constructs an ApiError instance with the appropriate status code and message.
 *
 * @param err - The original error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction): void => {
    let error = err;
    // Handle Twilio-specific error for unverified numbers
    if (err.message && err.message.includes('Trial accounts cannot send messages to unverified numbers')) {
        error = new ApiError(
            httpStatus.BAD_REQUEST,
            'Unable to send SMS. Please verify your phone number or contact support for assistance.',
            true,
            err.stack
        );
    } else if (err.code === 'ECONNRESET') {
        error = new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Connection was reset. Please try again later.', true, err.stack);
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
        const fieldName = Object.keys(err.keyValue)[0];
        const duplicateValue = err.keyValue[fieldName];
        const message = `Duplicate value for field "${fieldName}": "${duplicateValue}"`;
        error = new ApiError(httpStatus.CONFLICT, message, true, err.stack);
    } else if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || (error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR);
        const message = error.message || httpStatus[statusCode as keyof typeof httpStatus];

        error = new ApiError(statusCode, message, false, err.stack);
    }

    next(error);
};

/**
 * Handles and responds to errors, logging details in development mode.
 * In production, only operational errors are reported to the client to avoid exposing sensitive details.
 *
 * @param err - The error object passed down to this handler.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR as keyof typeof httpStatus]) || 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack })
    };

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(statusCode).json({ error: response });
};

export { errorConverter, errorHandler };
