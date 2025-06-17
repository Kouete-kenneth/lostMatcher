import morgan, { StreamOptions } from 'morgan';
import config from './env.config';
import logger from './logging.config';
import { Request, Response } from 'express';

// Custom token for logging error messages
morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

// Function to set IP format based on environment
const getIpFormat = (): string => (config.env === 'production' ? ':remote-addr - ' : '');

// Log formats for success and error responses
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// Stream options to handle log message writing
const successStream: StreamOptions = {
    write: (message: string) => logger.info(message.trim())
};

const errorStream: StreamOptions = {
    write: (message: string) => logger.error(message.trim())
};

// Success handler for logging requests with status < 400
const successHandler = morgan(successResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode >= 400,
    stream: successStream
});

// Error handler for logging requests with status >= 400
const errorHandler = morgan(errorResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    stream: errorStream
});

export { successHandler, errorHandler };
