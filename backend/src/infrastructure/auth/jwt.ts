import jwt from 'jsonwebtoken';
import { config } from '@config/index';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWT {
  private static readonly accessSecret = config.jwt.secret;
  private static readonly refreshSecret = config.jwt.refreshSecret;
  private static readonly accessExpiresIn = config.jwt.accessExpiresIn;
  private static readonly refreshExpiresIn = config.jwt.refreshExpiresIn;

  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    });
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.accessSecret) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.refreshSecret) as JwtPayload;
  }
}
