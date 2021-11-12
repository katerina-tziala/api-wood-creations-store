import express, { Request, Response } from 'express';

import { Product, ProductStore } from '../models/Product';

const productsRouter = express.Router();
const store: ProductStore = new ProductStore();

productsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const products: Product[] = await store.getAll();
    res.json(products);
  } catch (error) {
    const errorMessage = error as Error;
    res.status(500).json({ error: errorMessage.message });
  }
});

export default productsRouter;
