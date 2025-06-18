import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
    windowMs: number; // time window in ms
    max: number; // max requests per window per IP
}

const rateLimiters: Record<string, { count: number; expires: number }> = {};

const rateLimiter = (options: RateLimitOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || '';
        const now = Date.now();

        if (!rateLimiters[ip] || rateLimiters[ip].expires < now) {
            rateLimiters[ip] = { count: 1, expires: now + options.windowMs };
        } else {
            rateLimiters[ip].count += 1;
        }

        if (rateLimiters[ip].count > options.max) {
            res.status(429).json({ message: 'Too many requests, please try again later.' });
        } else {
            next();
        }
    };
};

export default rateLimiter;