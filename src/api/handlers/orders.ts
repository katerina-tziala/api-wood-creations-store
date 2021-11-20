import express, { NextFunction, Request, Response } from 'express';
import { OrderController } from '../controllers/order-controller';
import {
  adminGuard,
  authTokenGuard,
  idChecker
} from '../middlewares/middlewares';

import { Category, CategoryStore } from '../models/Category';
import { OrderStore, Order } from '../models/Order';

// const categoryIdChecker = idChecker('CATEGORY');

const store: OrderStore = new OrderStore();
const orderController = new OrderController();
const router = express.Router();

// Current Order by user (args: user id)[token required]
// [OPTIONAL] Completed Orders by user (args: user id)[token required]

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














// // Get all categories
// router.get(
//   '/',
//   [authTokenGuard, adminGuard],
//   async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const categories = await store.getAll();
//       res.status(200).json(categories);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // Get category
// router.get(
//   '/:id',
//   [authTokenGuard, adminGuard, categoryIdChecker],
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const userId: number = parseInt(req.params.id);
//     try {
//       const category = await store.getById(userId);
//       res.status(200).json(category);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // Update category
// router.patch(
//   '/:id',
//   [authTokenGuard, adminGuard, categoryIdChecker],
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const id: number = parseInt(req.params.id);
//     const updateData: Partial<Category> = { ...req.body, id };
//     try {
//       const updatedCategory = await store.update(updateData);
//       res.status(200).json(updatedCategory);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// // Delete category
// router.delete(
//   '/:id',
//   [authTokenGuard, adminGuard, categoryIdChecker],
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const id: number = parseInt(req.params.id);
//     try {
//       await store.deleteById(id);
//       res.status(200).send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export { router };
