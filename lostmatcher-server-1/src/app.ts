import express, { Request, Response } from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import { loggingHandler } from './middlewares/loggingHandler';
import config from './config/env.config';
import * as errors from './middlewares/error';
import { jwtStrategy } from './config/passport';
import { successHandler, errorHandler } from './config/morgan';
import authLimiter from './middlewares/authLimiter';
import logger from './config/logging.config';
import Routes from './routes';
// import sessionMiddleware from './middlewares/session.middleware';
const app = express();
app.disable('x-powered-by');
// Logging middleware (non-test only)
if (config.env !== 'test') {
    app.use(successHandler);
    app.use(errorHandler);
}
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(loggingHandler);
app.use(mongoSanitize());
app.use(compression());
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://reepls.netlify.app',
        'https://reepls-web.vercel.app',
        'https://reepls.com',
        'https://reepls.cm'
    ],
};
app.use(cors(corsOptions));
// CORS Preflight handler
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.sendStatus(200);
});
// Passport & Session
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// app.use(sessionMiddleware);
// app.use(passport.session());

// ✅ Basic route
app.get('/', (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({ hello: 'world!' });
});
// Auth rate limiter (production only)
if (config.env === 'production') {
    app.use('/api-v1/auth', authLimiter);
}
app.use('/api-v1', Routes); 
// 404 handler (Express 5 supports res.notFound())
app.use((req, res, next) => {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Not found' });
});
// Error handlers
logger.log('-----------------------------------------');
logger.info(`Environment: ${config.env}`);
logger.log('-----------------------------------------');
app.use(errors.errorConverter);
app.use(errors.errorHandler);

export default app;
