import express, { NextFunction, Request, Response } from 'express';

import { User, UserStore } from '../models/User';
import { Order, OrderStore } from '../models/Order';
import { generateUserToken } from '../../utilities/token';

import {
  adminGuard,
  authTokenGuard,
  idChecker
} from '../middlewares/@middlewares.module';

import {
  checkCredentials,
  checkCreation,
  checkUpdate
} from '../middlewares/validations/user-validation';

const userIdChecker = idChecker('USER');
const router = express.Router();
const store: UserStore = new UserStore();
const ordersStore: OrderStore = new OrderStore();

// Authenticate user
router.post(
  '/authenticate',
  checkCredentials,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    try {
      const user = await store.authenticate(username as string, password as string);
      !user
        ? res.status(401).json({ error: 'WRONG_CREDENTIALS' })
        : res.status(200).json({ accessToken: generateUserToken(user) });
    } catch (error) {
      next(error);
    }
  }
);

// Create user
router.post(
  '/',
  [authTokenGuard, adminGuard, checkCreation],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data: Omit<User, 'id'> = req.body;
    try {
      const newUser: User = await store.create(data);
      res.status(200).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

// Get user
router.get(
  '/:id',
  [authTokenGuard, adminGuard, userIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = parseInt(req.params.id);
    try {
      const user = await store.getById(userId);
      const recentOrders: Order[] = await ordersStore.getCompletedOrdersOfUser(
        userId,
        5
      );
      const currentOrder = await ordersStore.getCurrentOrderOfUser(userId);
      const userData = {
        ...user,
        recentOrders,
        currentOrder: currentOrder ? currentOrder : null
      };
      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }
);

// Get all users
router.get(
  '/',
  [authTokenGuard, adminGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users: User[] = await store.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// Update user
router.patch(
  '/:id',
  [authTokenGuard, adminGuard, userIdChecker, checkUpdate],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id);
    const updateData: Partial<User> = { ...req.body, id };
    try {
      const updatedUser = await store.update(updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// Delete user
router.delete(
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
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router };
