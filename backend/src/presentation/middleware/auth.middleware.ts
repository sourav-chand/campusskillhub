import { Request, Response, NextFunction } from 'express';
import { JWT } from '@infrastructure/auth/jwt';
import { AppError } from '@shared/errors/AppError';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Access denied. No token provided.', 401));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JWT.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
};
