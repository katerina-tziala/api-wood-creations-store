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

function handleError(error: Error, req: Request, res: Response, next: NextFunction) {
  const message = error.message;
  if (message === 'NOT_FOUND' || message ==='CURRENT_ORDER_NOT_FOUND') {
    res.status(404).json({error: message});
    return;
  }

  if (message === 'CURRENT_ORDER_EXISTS' ) {
    res.status(403).json({error: message});
    return;
  }

  
  console.log(error.message);
  
  console.log('ERROR ----');

  console.error(error);
  res.status(500).send('Something broke!');
}

api.use(handleError);

export default api;
