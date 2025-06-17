import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import config from './env.config';
import { tokenTypes } from './tokens.config';
import User, { IUser } from '../models/user.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

interface JwtPayload {
    sub: string;
    type: string;
    iat?: number;
    exp?: number;
}

const jwtOptions: StrategyOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload: JwtPayload, done: VerifiedCallback): Promise<void> => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new ApiError(httpStatus.NOT_ACCEPTABLE,'Invalid token type');
        }
        const user: IUser | null = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
