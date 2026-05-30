import { JwtPayload } from '@infrastructure/auth/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        collegeId?: string;
      };
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};
