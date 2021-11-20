import express, { NextFunction, Request, Response } from 'express';

import { router as UsersRouter } from './handlers/users';
import { router as CategoriesRouter } from './handlers/categories';
import { router as ProductsRouter } from './handlers/products';
import { router as OrdersRouter } from './handlers/orders';



const api = express.Router();

api.use('/users', UsersRouter);
api.use('/categories', CategoriesRouter);
api.use('/products', ProductsRouter);
api.use('/orders', OrdersRouter);

api.get('/', async (_, res: Response): Promise<void> => {
  res.status(200).send('API is listening...');
});



function handleError(err: Error, req: Request, res: Response, next: any) {
  console.log('ERROR ----');

  console.error(err);
  res.status(500).send('Something broke!');
}

api.use(handleError);

export default api;
