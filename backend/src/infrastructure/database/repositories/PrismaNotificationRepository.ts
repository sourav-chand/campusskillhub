import { PrismaClient } from '@prisma/client';
import { INotificationRepository } from '@domain/repositories/INotificationRepository';
import { Notification } from '@domain/entities/Notification';

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    message: string;
    type: string;
    category: string;
    isRead: boolean;
    userId: string;
    senderId: string | null;
    link: string | null;
    createdAt: Date;
  }): Notification {
    return new Notification(
      data.id,
      data.userId,
      data.type,
      data.title,
      data.message,
      data.isRead,
      data.isRead ? data.createdAt : null,
      { category: data.category, link: data.link },
      data.createdAt,
    );
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    return notification ? this.mapToEntity(notification) : null;
  }

  async create(notification: Notification): Promise<Notification> {
    const metadata = notification.metadata as Record<string, unknown> | null;
    const created = await this.prisma.notification.create({
      data: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        category: (metadata?.category as string) ?? 'GENERAL',
        isRead: notification.isRead,
        userId: notification.userId,
        link: (metadata?.link as string) ?? null,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification | null> {
    const updateData: Record<string, unknown> = {};
    if (data.isRead !== undefined) updateData.isRead = data.isRead;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.message !== undefined) updateData.message = data.message;

    const updated = await this.prisma.notification.update({
      where: { id },
      data: updateData,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.notification.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany();
    return notifications.map((n) => this.mapToEntity(n));
  }

  async findByUser(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map((n) => this.mapToEntity(n));
  }

  async markAsRead(id: string): Promise<Notification | null> {
    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return this.mapToEntity(updated);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}
