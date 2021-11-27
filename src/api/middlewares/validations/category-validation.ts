import { Request, Response, NextFunction } from 'express';
import { stringValidationError } from '../../../utilities/validations';

export function checkCategoryName(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name } = req.body;
  const error = stringValidationError(name, 'name', 3);
  error ? res.status(400).json({ error }) : next();
}
