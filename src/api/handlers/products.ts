import express, { NextFunction, Request, Response } from 'express';
import { Product, ProductStore } from '../models/Product';
import {
  adminGuard,
  authTokenGuard,
  idChecker
} from '../middlewares/middlewares';

const productIdChecker = idChecker('PRODUCT');
const categoryIdChecker = idChecker('CATEGORY');

const router = express.Router();
const store: ProductStore = new ProductStore();

// Create product
router.post(
  '/',
  [authTokenGuard, adminGuard],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product: Omit<Product, 'id'> = await store.create(req.body);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Get all products
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products: Product[] = await store.getAll();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// Get 5 most popular products
router.get(
  '/popular/',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products: Product[] = await store.getTopFive();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
);

// Get product
router.get(
  '/:id',
  productIdChecker,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: number = parseInt(req.params.id);
      const product: Product = await store.getById(productId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Get products by category
router.get(
  '/category/:id',
  categoryIdChecker,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categoryId: number = parseInt(req.params.id);
    try {
      const products: Product[] = await store.getByCategory(categoryId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
);

// Update product
router.patch(
  '/:id',
  [authTokenGuard, adminGuard, productIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id);
    const updateData: Partial<Product> = { ...req.body, id };
    try {
      const updatedUser = await store.update(updateData);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// Delete product
router.delete(
  '/:id',
  [authTokenGuard, adminGuard, productIdChecker],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id: number = parseInt(req.params.id);
    try {
      await store.deleteById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router };
