import Joi, { SchemaMap } from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import { Request, Response, NextFunction } from 'express';

// Extend the Request type to define the properties that will be picked
interface ValidatedRequest extends Request {
    body: any;
    query: any;
    params: any;
}

const validate = (schema: { params?: SchemaMap; query?: SchemaMap; body?: SchemaMap }) => {
    return (req: ValidatedRequest, res: Response, next: NextFunction) => {
        const validSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validSchema) as (keyof ValidatedRequest)[]);
        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(object);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }

        Object.assign(req, value);
        return next();
    };
};

export default validate;
