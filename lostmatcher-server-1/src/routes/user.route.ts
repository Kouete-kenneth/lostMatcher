import express from 'express';
import { auth } from '../middlewares/auth';
import validate from '../middlewares/validate';
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../validations/user.validation';
import * as userController from '../controllers/user.controller';

const userRoutes = express.Router();

userRoutes.route('/create')
  .post(auth('manageUsers'), validate({ body: createUser }), userController.createUser)
  .get(auth('getUsers'), validate({ query: getUsers }), userController.getUsers);

userRoutes.route('/:userId')
  .get(auth('getUsers'), validate({ params: getUser }), userController.getUser)
  .patch(auth('manageUsers'), validate({ params: getUser, body: updateUser }), userController.updateUser)
  .delete(auth('manageUsers'), validate({ params: deleteUser }), userController.deleteUser);

export default userRoutes;
