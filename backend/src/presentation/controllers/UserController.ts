import { Request, Response, NextFunction } from 'express';
import { container } from '@config/container';

export class UserController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userRepository } = container.repositories;
      const users = await (userRepository as never as { findAll: (filter: unknown) => Promise<{ data: unknown[]; total: number }> }).findAll(req.query);
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userRepository } = container.repositories;
      const user = await (userRepository as never as { findById: (id: string) => Promise<unknown> }).findById(req.params.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userRepository } = container.repositories;
      const user = await (userRepository as never as { update: (id: string, data: unknown) => Promise<unknown> }).update(req.user!.userId, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bcrypt = await import('bcryptjs');
      const { userRepository } = container.repositories;
      const userRepo = userRepository as never as {
        findById: (id: string) => Promise<{ password: string } | null>;
        updatePassword: (id: string, password: string) => Promise<void>;
        update: (id: string, data: unknown) => Promise<unknown>;
      };
      const user = await userRepo.findById(req.user!.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password is incorrect' });
        return;
      }
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
      await userRepo.updatePassword(req.user!.userId, hashedPassword);
      res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userRepository } = container.repositories;
      await (userRepository as never as { update: (id: string, data: { isActive: boolean }) => Promise<unknown> }).update(req.params.id, { isActive: false });
      res.status(200).json({ success: true, message: 'User deactivated successfully' });
    } catch (error) {
      next(error);
    }
  };

  activate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userRepository } = container.repositories;
      await (userRepository as never as { update: (id: string, data: { isActive: boolean }) => Promise<unknown> }).update(req.params.id, { isActive: true });
      res.status(200).json({ success: true, message: 'User activated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
