import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export function adminGuard(_req: Request, res: Response, next: NextFunction) {
  const { role } = res.locals.userData;
  role === UserRole.Admin
    ? next()
    : res.status(403).json({ error: 'FORBIDDEN_FOR_CUSTOMER' });
}
