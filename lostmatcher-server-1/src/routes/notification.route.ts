import express from 'express';
import { addNotification, getNotifications, removeNotification, updateNotification } from '../controllers/notification.controller';
import * as notificationValidation from '../validations/notification.validation'
import validate from '../middlewares/validate';
const notificationRoutes = express.Router();

// Route to create a new notification
notificationRoutes.post('/', validate(notificationValidation.createNotification), addNotification);

// Route to fetch all notifications for a user
notificationRoutes.get('/:userId', validate(notificationValidation.getAllNotifications), getNotifications);

// Route to update a notifications
notificationRoutes.put('/:notificationId', validate(notificationValidation.updateNotification), updateNotification);

// Route to delete a notification
notificationRoutes.delete('/:notificationId', validate(notificationValidation.deleteNotification), removeNotification);

export default notificationRoutes;
