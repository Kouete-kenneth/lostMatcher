import Joi from 'joi';
import { objectId } from './custom.validation';


/**
 * Validation schema for creating a notification
 */
const createNotification = {
  body: Joi.object({
    userId: Joi.string().custom(objectId).required(),
    senderId: Joi.string().custom(objectId).required(),
    content: Joi.string().required().trim(),
    title: Joi.string().required().trim(),
    linkText: Joi.string().optional().trim(),
    recipientType: Joi.string().valid('user', 'chosen', 'everyone').required(),
    recipients: Joi.array().items(Joi.string().custom(objectId)).optional(),
    status: Joi.string().valid('read', 'unread').optional(),
  }),
};

/**
 * Validation schema for getting all notifications for a user
 */
const getAllNotifications = {
  params: Joi.object({
    userId: Joi.string().custom(objectId).required(),
  }),
};

/**
 * Validation schema for updating a notification
 */
const updateNotification = {
  params: Joi.object({
    notificationId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object({
    content: Joi.string().optional().trim(),
    title: Joi.string().optional().trim(),
    linkText: Joi.string().optional().trim(),
    recipientType: Joi.string().valid('user', 'chosen', 'everyone').optional(),
    recipients: Joi.array().items(Joi.string().custom(objectId)).optional(),
    status: Joi.string().valid('read', 'unread').optional(),
  }).min(1).message('you need to make atleast on change'),
};

/**
 * Validation schema for deleting a notification
 */
const deleteNotification = {
  params: Joi.object({
    notificationId: Joi.string().custom(objectId).required(),
  }),
};

export {
  createNotification,
  getAllNotifications,
  updateNotification,
  deleteNotification,
};
