import { Request, Response, NextFunction } from 'express';
import { GetNotificationsUseCase } from '@application/usecases/notification/get-notifications.usecase';
import { MarkReadUseCase } from '@application/usecases/notification/mark-read.usecase';
import { container } from '@config/container';

export class NotificationController {
  constructor(
    private getNotificationsUseCase: GetNotificationsUseCase,
    private markReadUseCase: MarkReadUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.getNotificationsUseCase.execute({
        userId,
        ...req.query,
      } as never);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
        unreadCount: result.unreadCount,
      });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.markReadUseCase.execute({ id: req.params.id });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  markAllRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const result = await this.markReadUseCase.execute({ userId });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { notificationRepository } = container.repositories;
      const count = await (notificationRepository as never as { countUnread: (userId: string) => Promise<number> }).countUnread(userId);
      res.status(200).json({ success: true, data: { unreadCount: count } });
    } catch (error) {
      next(error);
    }
  };
}
