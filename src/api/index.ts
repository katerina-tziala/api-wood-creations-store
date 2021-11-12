import express, { Response } from 'express';

import productsRouter from './handlers/products';

const api = express.Router();

api.use('/products', productsRouter);

api.get('/', async (_, res: Response): Promise<void> => {
  res.status(200).send('API is listening...');
});

export default api;
