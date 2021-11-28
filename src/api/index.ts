import express, { Request, Response, NextFunction } from 'express';
import * as Routes from './routes/@routes.module';

const api = express.Router();

api.use('/users', Routes.Users);
api.use('/categories', Routes.Categories);
api.use('/products', Routes.Products);
api.use('/orders', Routes.Orders);


api.get('/', async (_, res: Response): Promise<void> => {
  res.status(200).send('API is listening...');
});

function handleError(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log('ERROR ----');

  console.error(err);
  res.status(500).send('Something broke!');
}

api.use(handleError);

export default api;
