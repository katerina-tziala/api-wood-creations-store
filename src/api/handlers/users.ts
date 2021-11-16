import express, { NextFunction, Request, Response } from 'express';

import { User, UserStore } from '../models/User';
import { generateUserToken } from '../../utilities/token';

import {
  adminGuard,
  authTokenGuard,
  idChecker
} from '../middlewares/middlewares';

const userIdChecker = idChecker('USER');

const usersRouter = express.Router();
const store: UserStore = new UserStore();
// TODO: endpoints for customers and admins???

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const user = await store.authenticate(username, password);
    !user
      ? res.status(401).json({ error: 'WRONG_CREDENTIALS' })
      : res.json(generateUserToken(user));
  } catch (error) {
    next(error);
  }
};

// Authenticate user
usersRouter.use('/authenticate', authenticate);

// Create user
usersRouter.post(
  '/',
  [authTokenGuard, adminGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await store.create(req.body);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

// Get user
usersRouter.get(
  '/:id',
  [authTokenGuard, adminGuard, userIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = parseInt(req.params.id);
    try {
      const user = await store.getById(userId);
      //Add a users 5 most recent purchases to the data being sent back from the user show endpoint (/users/id)

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// Get all users
usersRouter.get(
  '/',
  [authTokenGuard, adminGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await store.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// Delete user
usersRouter.delete(
  '/:id',
  [authTokenGuard, adminGuard, userIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = parseInt(req.params.id);
    const { id } = res.locals.userData;
    if (id === userId) {
      res.status(403).json({ error: 'OWN_ACCOUNT_DELETION_FORBIDDEN' });
      return;
    }
    try {
      await store.deleteById(userId);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

// Update user
usersRouter.patch(
  '/',
  [authTokenGuard, adminGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedUser = await store.update(req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
