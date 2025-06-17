import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
// Use CommonJS __dirname for compatibility
// __dirname is available by default in CommonJS environments

dotenv.config();

const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';
export const PRODUCTION = process.env.NODE_ENV === 'production';

const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    SERVER_HOSTNAME: Joi.string().required().description('Localhost During Development'),
    MONGODB_URL: Joi.string().required().description('MongoDB connection URL'),
    DB_NAME: Joi.string().default('saah').description('Database name'),
    DB_TIMEOUT: Joi.number().default(20000).description('Database connection timeout in milliseconds'),
    MAX_IDLE_TIME: Joi.number().default(10000).description('Close idle connections after 10 seconds'),

    DB_URL_DIGITAL_OCEAN: Joi.string().description('Digital Ocean MongoDB connection URL'),
    DB_NAME_DIGITAL_OCEAN: Joi.string().default('reepls-db').description('Digital Ocean database name'),
    DB_TIMEOUT_DIGITAL_OCEAN: Joi.number().default(20000).description('Digital Ocean database connection timeout in milliseconds'),
    MAX_IDLE_TIME_DIGITAL_OCEAN: Joi.number().default(10000).description('Digital Ocean idle connection timeout'),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('JWT access token expiration in minutes'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('JWT refresh token expiration in days'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('Reset password token expiration in minutes'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('Verify email token expiration in minutes'),
    SMTP_HOST: Joi.string().description('SMTP server host'),
    SMTP_SERVICE: Joi.string().description('Email service provider'),
    SMTP_PORT: Joi.number().default(465).description('SMTP server port'),
    SMTP_USERNAME: Joi.string().description('SMTP server username'),
    SMTP_PASSWORD: Joi.string().description('SMTP server password'),
    SMTP_SECURE: Joi.boolean().default(true).description('Use secure SMTP connection'),
    EMAIL_FROM: Joi.string().email().description('Email "from" address'),
    TWILIO_ACCOUNT_SID: Joi.string().description('Twilio account SID'),
    TWILIO_AUTH_TOKEN: Joi.string().description('Twilio auth token'),
    TWILIO_PHONE_NUMBER: Joi.string().description('Twilio phone number'),
    GOOGLE_CLIENT_ID: Joi.string().description('google client ID'),
    GOOGLE_CLIENT_SECRET: Joi.string().description('google client Secret'),
    PROJECT_ID: Joi.string().alphanum().min(3).max(50),
    REDIRECT_URIS: Joi.string().uri({ scheme: ['http', 'https'] }),
    AUTH_URI: Joi.string().uri({ scheme: ['http', 'https'] }),
    SESSION_ID: Joi.string().default('sid').description('Session ID key'),
    SESSION_SECRET: Joi.string().default('secrete!session').description('Session secret key'),
    SESSION_LIFETIME: Joi.number().default(7200000).description('Session lifetime in milliseconds'),
    CLOUDINARY_CLOUD_NAME: Joi.string().required().description('Cloudinary cloud name'),
    CLOUDINARY_API_KEY: Joi.string().required().description('Cloudinary API key'),
    CLOUDINARY_API_SECRET: Joi.string().required().description('Cloudinary API secret'),
    CLOUDINARY_URL: Joi.string().uri().required().description('Cloudinary full URL'),

    UNREAL_API_KEY: Joi.string().required().description('Unreal API key'),
    UNREAL_API_URL: Joi.string().uri().required().description('Unreal API URL'),
    UNREAL_API_URL_SYNTHESIS: Joi.string().uri().required().description('Unreal API Synthesis URL'),

    PUSH_PUBLIC_KEY: Joi.string().required().description('push notification public key'),
    PUSH_PRIVATE_KEY: Joi.string().required().description('push notification private key')
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env, { abortEarly: false });

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    server: envVars.SERVER_HOSTNAME,
    mongoose: {
        url: `${envVars.MONGODB_URL}${envVars.DB_NAME}${envVars.NODE_ENV === 'test' ? '-test' : ''}`,
        options: {
            dbName: envVars.DB_NAME,
            serverSelectionTimeoutMS: envVars.DB_TIMEOUT,
            maxIdleTimeMS: envVars.MAX_IDLE_TIME
        }
    },
    digitalOcean: {
        url: envVars.DB_URL_DIGITAL_OCEAN,
        dbName: envVars.DB_NAME_DIGITAL_OCEAN,
        options: {
            serverSelectionTimeoutMS: envVars.DB_TIMEOUT_DIGITAL_OCEAN,
            maxIdleTimeMS: envVars.MAX_IDLE_TIME_DIGITAL_OCEAN
        }
    },
    session: {
        id: envVars.SESSION_ID,
        secret: envVars.SESSION_SECRET,
        lifeTime: envVars.SESSION_LIFETIME
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            service: envVars.SMTP_SERVICE,
            port: envVars.SMTP_PORT,
            secure: envVars.SMTP_SECURE,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD
            },
            tls: { rejectUnauthorized: true }
        },
        from: envVars.EMAIL_FROM
    },
    sms: {
        accountSid: envVars.TWILIO_ACCOUNT_SID,
        authToken: envVars.TWILIO_AUTH_TOKEN,
        phoneNumber: envVars.TWILIO_PHONE_NUMBER
    },
    google: {
        client_secret: envVars.GOOGLE_CLIENT_SECRET,
        client_id: envVars.GOOGLE_CLIENT_ID,
        project_id: envVars.PROJECT_ID,
        redirect_uri: envVars.REDIRECT_URIS,
        auth_url: envVars.AUTH_URI
    },
    cloudinary: {
        cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
        api_key: envVars.CLOUDINARY_API_KEY,
        api_secret: envVars.CLOUDINARY_API_SECRET,
        url: envVars.CLOUDINARY_URL
    },
    unreal_speech: {
        api_key: envVars.UNREAL_API_KEY,
        api_url: envVars.UNREAL_API_URL,
        api_synthesis_url: envVars.UNREAL_API_URL_SYNTHESIS
    },
    web_push: {
        push_public: envVars.PUSH_PUBLIC_KEY,
        push_private: envVars.PUSH_PRIVATE_KEY
    }
};

export default config;


