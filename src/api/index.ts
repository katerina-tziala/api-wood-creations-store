import express, { Request, Response, NextFunction } from 'express';
import * as Routes from './routes/@routes.module';
import {
  ResponseError,
  getResponseError
} from '../utilities/error-handling/response-error-handling';
const api = express.Router();

api.use('/users', Routes.Users);
api.use('/categories', Routes.Categories);
api.use('/products', Routes.Products);
api.use('/orders', Routes.Orders);

api.get('/', async (_, res: Response): Promise<void> => {
  res.status(200).send('API is listening...');
});

function handleError(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { statusCode, ...errorData }: ResponseError = getResponseError(error);
  res.status(statusCode).json(JSON.parse(JSON.stringify(errorData)));
}

api.use(handleError);

export default api;
