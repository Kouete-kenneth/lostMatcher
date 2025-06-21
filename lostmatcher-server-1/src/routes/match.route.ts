import express from 'express';
import { matchDescriptionsController } from '../controllers/matches.controller';

const matchRoutes = express.Router();

/**
 * Route to handle matching descriptions.
 */
matchRoutes.post('/', matchDescriptionsController);

export default matchRoutes;