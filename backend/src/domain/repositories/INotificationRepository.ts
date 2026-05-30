import { Notification } from '../entities/Notification';

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>;
  create(notification: Notification): Promise<Notification>;
  update(id: string, data: Partial<Notification>): Promise<Notification | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Notification[]>;
  findByUser(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification | null>;
  getUnreadCount(userId: string): Promise<number>;
}
