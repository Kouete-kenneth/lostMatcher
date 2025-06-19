import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import * as services from '../services/user.service';

import { Request, Response } from 'express';

const createUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = await services.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((val: any) => val.message);
      return res.status(httpStatus.BAD_REQUEST).json({ error: errors });
    }
    console.error('Error creating user:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await services.queryUsers(filter, options);
    res.send(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const user = await services.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).send({ error: error.message });
    } else {
      console.error('Error fetching user:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Internal Server Error' });
    }
  }
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const existingUser = await services.getUserById(userId);
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const updatedUser = await services.updateUserById(userId, req.body);
  res.status(httpStatus.OK).json({ message: 'Update done successfully', user: updatedUser });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const existingUser = await services.getUserById(userId);
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await services.deleteUserById(userId);
  res.status(httpStatus.OK).send({ message: 'User deleted successfully' });
});

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
