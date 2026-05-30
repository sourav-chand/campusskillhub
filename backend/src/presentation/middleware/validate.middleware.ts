import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          errors.body = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        } else {
          req.body = result.data;
        }
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          errors.query = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        } else {
          req.query = result.data;
        }
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          errors.params = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        } else {
          req.params = result.data as Record<string, string>;
        }
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};
