import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../../models/User';
import {
  stringValidationError,
  optionalStringValidationError,
  requiredDataError
} from '../../../utilities/validations';

export function checkCredentials(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getCredentials(req.body);
  const { username, password } = req.body;
  const error =
    requiredDataError(req.body, 'CREDENTIALS_REQUIRED') ||
    stringValidationError(username, 'username') ||
    stringValidationError(password, 'password');
  error ? res.status(400).json({ error }) : next();
}

export function checkCreation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getUserData(req.body);
  const error = requiredDataError<User>(req.body) || getCreationError(req.body);
  error ? res.status(400).json({ error }) : next();
}

export function checkUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.body = getUserData(req.body);
  const error = requiredDataError<User>(req.body) || geUpdateError(req.body);
  error ? res.status(400).json({ error }) : next();
}

function getCredentials(params: Partial<User>): {
  username?: string;
  password?: string;
} {
  const { username, password } = params;
  const credentials = {
    username: username ? username.toString().trim() : undefined,
    password: password ? password.toString().trim() : undefined
  };
  return JSON.parse(JSON.stringify(credentials));
}

function getUserData(params: Partial<User>): Partial<User> {
  const { firstname, lastname } = params;
  const credentials = getCredentials(params);
  const name = {
    firstname: firstname ? firstname.toString().trim() : undefined,
    lastname: lastname ? lastname.toString().trim() : undefined
  };
  return JSON.parse(JSON.stringify({ ...name, ...credentials }));
}

function getCreationError(params: Omit<User, 'id'>): string | undefined {
  const { username, firstname, lastname, password } = params;
  return (
    stringValidationError(username, 'username') ||
    stringValidationError(password as string, 'password') ||
    stringValidationError(firstname, 'firstname', 3) ||
    stringValidationError(lastname, 'lastname', 3)
  );
}

function geUpdateError(params: Omit<User, 'id'>): string | undefined {
  const { username, firstname, lastname, password } = params;
  return (
    optionalStringValidationError(username, 'username') ||
    optionalStringValidationError(password as string, 'password') ||
    optionalStringValidationError(firstname, 'firstname', 3) ||
    optionalStringValidationError(lastname, 'lastname', 3)
  );
}
