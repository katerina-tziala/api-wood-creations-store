import express, { NextFunction, Request, Response } from 'express';

// import productsRouter from './handlers/products';
import usersRouter from './handlers/users';

const api = express.Router();

api.use('/users',  usersRouter);

api.get('/', async (_, res: Response): Promise<void> => {
  res.status(200).send('API is listening...');
});



function handleError(err: Error, req: Request, res: Response, next: any)  {
  console.log('ERROR ----');
  
  console.error(err)
  res.status(500).send('Something broke!')
}


api.use(handleError)

export default api;
