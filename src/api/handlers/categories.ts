import express, { NextFunction, Request, Response } from 'express';
import {
  adminGuard,
  authTokenGuard,
  idChecker
} from '../middlewares/middlewares';
import { Category, CategoryStore } from '../models/Category';

const categoryIdChecker = idChecker('CATEGORY');

const router = express.Router();
const store: CategoryStore = new CategoryStore();

// Create category
router.post(
  '/',
  [authTokenGuard, adminGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newCategory: Exclude<Category, 'id'> = await store.create(req.body);
      res.status(200).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

// Get all categories
router.get(
  '/',
  [authTokenGuard, adminGuard],
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await store.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
);

// Get category
router.get(
  '/:id',
  [authTokenGuard, adminGuard, categoryIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: number = parseInt(req.params.id);
    try {
      const category = await store.getById(userId);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }
);

// Update category
router.patch(
  '/:id',
  [authTokenGuard, adminGuard, categoryIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id);
    const updateData: Partial<Category> = { ...req.body, id };
    try {
      const updatedCategory = await store.update(updateData);
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
);

// Delete category
router.delete(
  '/:id',
  [authTokenGuard, adminGuard, categoryIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id);
    try {
      await store.deleteById(id);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router };
