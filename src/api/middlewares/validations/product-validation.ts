import { Request, Response, NextFunction } from 'express';
import {
  stringValidationError,
  optionalStringValidationError
} from '../../../utilities/validations';

// export function checkCredentials(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   const { username, password } = req.body;
//   const error =
//     stringValidationError(username, 'username') ||
//     stringValidationError(password, 'password');
//   error ? res.status(400).json({ error }) : next();
// }
