import express, { NextFunction, Request, Response } from 'express';
import { OrderController } from '../controllers/order-controller';
import {
  authTokenGuard,
  idChecker
} from '../middlewares/@middlewares.module';

import { OrderStore, Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

const itemIdChecker = idChecker('ORDER_ITEM');

const store: OrderStore = new OrderStore();

const orderController = new OrderController();
const router = express.Router();

// Create order
router.post(
  '/',
  [authTokenGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { item, calledAt, comments } = req.body;
    const orderData: Partial<Order> = {
      created_at: new Date(calledAt),
      customer_id: res.locals.userData.id,
      comments: comments ? comments : null
    };
    try {
      const order = await orderController.createOrder(orderData, item);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Get orders of user
router.get(
  '/',
  [authTokenGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = res.locals.userData.id;
    try {
      const orders = await store.getOrdersOfUser(userId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
);

// Get completed orders of user
router.get(
  '/completed/',
  [authTokenGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = res.locals.userData.id;
    try {
      const orders = await store.getCompletedOrdersOfUser(userId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
);

// Get current order of user
router.get(
  '/current/',
  [authTokenGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = res.locals.userData.id;
    try {
      const order: Order = await orderController.getCurrentOrder(userId);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Add item in current order
router.post(
  '/current/item/',
  [authTokenGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await orderController.addItemInCurrentOrder(
        res.locals.userData.id,
        req.body
      );
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Remove item from current order
router.delete(
  '/current/item/:id',
  [authTokenGuard, itemIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId: number = parseInt(req.params.id);
    try {
      const order = await orderController.deleteItemFromCurrentOrder(
        res.locals.userData.id,
        itemId
      );
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Update item in current order
router.patch(
  '/current/item/:id',
  [authTokenGuard, itemIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId: number = parseInt(req.params.id);
    const updateData: Partial<OrderItem> = req.body;
    try {
      const order = await orderController.updateItemInCurrentOrder(
        res.locals.userData.id,
        itemId,
        updateData
      );
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Complete current order
router.patch(
  '/current/complete/',
  [authTokenGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { calledAt, comments } = req.body;
    // TODO: validate calledAt
    try {
      const order = await orderController.completeCurrentOrder(
        res.locals.userData.id,
        new Date(calledAt),
        comments
      );
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Delete current order of user
router.delete(
  '/current/',
  [authTokenGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = res.locals.userData.id;
    try {
      await orderController.deleteCurrentOrder(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router };
