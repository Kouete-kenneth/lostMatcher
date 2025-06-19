import Joi from "joi";
import {objectId } from './custom.validation';
/**
 * Validation schema for creating Review
 */

const createReviewValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    content: Joi.string().required().trim().messages({
      'string.empty': '"content" cannot be an empty field',
      'any.required': '"content" is required',
    }),
    rating: Joi.number().required().min(1).max(5).messages({
      'number.base': '"rating" must be a number',
      'number.min': '"rating" must be at least 1',
      'number.max': '"rating" must be at most 5',
      'any.required': '"rating" is required',
    }),
    visibility: Joi.boolean().default(true),
  }),
};

/**
 * Validation schema for deleting review
 */
const deleteReviewValidation = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};


export {createReviewValidation,deleteReviewValidation};
