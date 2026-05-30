import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';
import { logger } from '@shared/utils/logger';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(err.message, {
    stack: err.stack,
    name: err.name,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = handlePrismaError(err);
    res.status(prismaError.statusCode).json({
      success: false,
      message: prismaError.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Invalid data provided',
    });
    return;
  }

  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      message: 'Token has expired',
    });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }

  if (err.name === 'MulterError') {
    const multerError = err as unknown as { code: string; message: string; field?: string };
    const statusCode = multerError.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    res.status(statusCode).json({
      success: false,
      message: multerError.message,
      field: multerError.field,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): {
  statusCode: number;
  message: string;
} {
  switch (err.code) {
    case 'P2002':
      return {
        statusCode: 409,
        message: `A record with this ${(err.meta?.target as string[])?.join(', ') || 'value'} already exists`,
      };
    case 'P2025':
      return {
        statusCode: 404,
        message: 'Record not found',
      };
    case 'P2003':
      return {
        statusCode: 400,
        message: 'Referenced record does not exist',
      };
    case 'P2014':
      return {
        statusCode: 400,
        message: 'Invalid relationship constraint',
      };
    default:
      return {
        statusCode: 500,
        message: 'Database error occurred',
      };
  }
}
