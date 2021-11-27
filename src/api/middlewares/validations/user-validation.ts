import { Request, Response, NextFunction } from 'express';
import {
  stringValidationError,
  optionalStringValidationError
} from '../../../utilities/validations';

export function checkCredentials(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { username, password } = req.body;
  const error =
    stringValidationError(username, 'username') ||
    stringValidationError(password, 'password');
  error ? res.status(400).json({ error }) : next();
}

export function checkCreation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { username, firstname, lastname, password } = req.body;
  const error =
    stringValidationError(username, 'username') ||
    stringValidationError(password, 'password') ||
    stringValidationError(firstname, 'firstname', 3) ||
    stringValidationError(lastname, 'lastname', 3);
  error ? res.status(400).json({ error }) : next();
}

export function checkUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { username, firstname, lastname, password } = req.body;

  const error =
    optionalStringValidationError(username, 'username') ||
    optionalStringValidationError(password, 'password') ||
    optionalStringValidationError(firstname, 'firstname', 3) ||
    optionalStringValidationError(lastname, 'lastname', 3);

  error ? res.status(400).json({ error }) : next();
}
