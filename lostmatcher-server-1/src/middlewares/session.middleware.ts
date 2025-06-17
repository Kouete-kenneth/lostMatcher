import session, { SessionOptions } from 'express-session';
import connectMongo from 'connect-mongodb-session';
import logger from '../config/logging.config';
import config from '../config/env.config';

const MongoDBStore = connectMongo(session);

// Define types for the MongoDB session store
interface MongoDBStoreOptions {
    uri: string;
    collection: string;
    ttl: number;
}

// Initialize the MongoDB session store
const mongoDBStoreInstance = new MongoDBStore({
    uri: config.mongoose.url,
    collection: 'sessions',
    ttl: Math.floor(config.session.lifeTime / 1000) // Convert milliseconds to seconds
} as MongoDBStoreOptions);

// Event handler for successful session store connection
mongoDBStoreInstance.on('connected', () => {
    logger.log('-------------------------------')
    logger.info('Session store connected');
    logger.log('-------------------------------');
});

// Event handler for session store connection error
mongoDBStoreInstance.on('error', (error: Error) => {
    console.error('Session store connection error:', error);
});

// Define session options
const sessionOptions: SessionOptions = {
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    store: mongoDBStoreInstance,
    cookie: {
        maxAge: config.session.lifeTime // Session expiration time in milliseconds
    }
};

// Establish session middleware
const sessionMiddleware = session(sessionOptions);

export default sessionMiddleware;
