import { Request, Response, NextFunction } from 'express';
import { Category } from '../../models/Category';
import { stringValidationError } from '../../../utilities/validations';

export function checkCategoryName(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getCategoryData(req.body);
  const { name } = getCategoryData(req.body);
  const error = stringValidationError(name, 'name', 3);
  error ? res.status(400).json({ error }) : next();
}

function getCategoryData(params: Omit<Category, 'id'>): Omit<Category, 'id'> {
  let { name } = params;
  name = name.toString().trim();
  return { name };
}
