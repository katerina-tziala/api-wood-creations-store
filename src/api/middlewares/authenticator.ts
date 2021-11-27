import { Request, Response, NextFunction } from 'express';
import { verifyUserToken } from '../../utilities/token';

export function authTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization: string = req.headers.authorization || '';
    const token: string = authorization.split(' ').pop() || '';
    const userData = verifyUserToken(token);
    res.locals.userData = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}
