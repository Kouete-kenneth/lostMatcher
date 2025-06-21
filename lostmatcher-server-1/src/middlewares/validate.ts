import Joi, { ObjectSchema } from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import { Request, NextFunction } from 'express';

// No need to extend the Request type; use the standard Request type from Express

interface SchemaContainer {
    params?: ObjectSchema;
    query?: ObjectSchema;
    body?: ObjectSchema;
}

import { Response } from 'express';

const validate = (schema: SchemaContainer) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const validSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validSchema) as (keyof Request)[]);
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

