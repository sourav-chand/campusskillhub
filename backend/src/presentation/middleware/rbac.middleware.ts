import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (!allowedRoles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase())) {
      next(new AppError('Forbidden: insufficient permissions', 403));
      return;
    }

    next();
  };
};
