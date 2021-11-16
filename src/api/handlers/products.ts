import express, { NextFunction, Request, Response } from 'express';
import { QueryErrorType } from '../models/models-utilities/query-error';

import { Product, ProductStore } from '../models/Product';

import { idChecker } from '../middlewares/utilities';

const productIdChecker = idChecker('PRODUCT');
const categoryIdChecker = idChecker('CATEGORY');

const productsRouter = express.Router();
const store: ProductStore = new ProductStore();

// Get all products
productsRouter.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products: Product[] = await store.getAll();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
);

// Get product by id
productsRouter.get(
  '/:id',
  productIdChecker,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: number = parseInt(req.params.id);
      const product: Product = await store.getById(productId);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Get product by category
productsRouter.get(
  '/category/:id',
  categoryIdChecker, // can be an array
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categoryId: number = parseInt(req.params.id);
    try {
      const products: Product[] = await store.getByCategory(categoryId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
);

// Get product by category
productsRouter.get(
  '/top/:limit',
  // categoryIdChecker, // can be an array
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    console.log('get top top3, 5,10 ');
    
    res.json([]);
    // const categoryId: number = parseInt(req.params.id);
    // try {
    //   const products: Product[] = await store.getByCategory(categoryId);
    //   res.json(products);
    // } catch (error) {
    //   next(error);
    // }
  }
);


export default productsRouter;
