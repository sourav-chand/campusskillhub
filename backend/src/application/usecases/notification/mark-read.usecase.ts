import { AppError } from '../../../shared/errors/AppError';

export interface INotificationRepository {
  findById(id: string): Promise<{ id: string; userId: string } | null>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

export class MarkReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(params: { id?: string; userId?: string }) {
    if (params.id) {
      const notification = await this.notificationRepository.findById(params.id);
      if (!notification) {
        throw new AppError('Notification not found', 404);
      }
      await this.notificationRepository.markAsRead(params.id);
    } else if (params.userId) {
      await this.notificationRepository.markAllAsRead(params.userId);
    } else {
      throw new AppError('Either notification id or user id is required', 400);
    }

    return { message: 'Notification marked as read' };
  }
}
