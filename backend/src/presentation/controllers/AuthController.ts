import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '@application/usecases/auth/register.usecase';
import { LoginUseCase } from '@application/usecases/auth/login.usecase';
import { ForgotPasswordUseCase } from '@application/usecases/auth/forgot-password.usecase';
import { ResetPasswordUseCase } from '@application/usecases/auth/reset-password.usecase';
import { VerifyEmailUseCase } from '@application/usecases/auth/verify-email.usecase';
import { RefreshTokenUseCase } from '@application/usecases/auth/refresh-token.usecase';
import { LogoutUseCase } from '@application/usecases/auth/logout.usecase';
import { container } from '@config/container';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private verifyEmailUseCase: VerifyEmailUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.forgotPasswordUseCase.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.resetPasswordUseCase.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.verifyEmailUseCase.execute({ token: req.params.token });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken;
      const userId = req.user?.userId;
      const result = await this.logoutUseCase.execute({ refreshToken, userId });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userRepository } = container.repositories;
      const user = await (userRepository as never as { findById: (id: string) => Promise<unknown> }).findById(req.user!.userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };
}
