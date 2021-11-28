import express, { NextFunction, Request, Response } from 'express';
import { OrderController } from '../controllers/order-controller';
import { authTokenGuard, idChecker } from '../middlewares/@middlewares.module';

import {
  checkCompletion,
  checkCreation,
  checkOrderItemCreation,
  checkOrderItemUpdate
} from '../middlewares/validations/order-validation';

import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

const itemIdChecker = idChecker('ORDER_ITEMD');

const orderController = new OrderController();
const router = express.Router();

// Create order
router.post(
  '/',
  [authTokenGuard, checkCreation],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { item, ...orderData } = req.body;
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
      const orders: Order[] = await orderController.getOrdersOfUser(userId);
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
      const orders = await orderController.getCompletedOrdersOfUser(userId);
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
      const order: Order | null = await orderController.getCurrentOrder(userId);
      !order ? res.status(404).send() : res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

// Add item in current order
router.post(
  '/current/item/',
  [authTokenGuard, checkOrderItemCreation],
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
  [authTokenGuard, itemIdChecker, checkOrderItemUpdate],
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
  [authTokenGuard, checkCompletion],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { completed_at, comments } = req.body;
    try {
      const order = await orderController.completeCurrentOrder(
        res.locals.userData.id,
        completed_at,
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
