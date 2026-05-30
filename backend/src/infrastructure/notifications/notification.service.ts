import { PrismaClient } from '@prisma/client';
import { Notification } from '@domain/entities/Notification';
import { PrismaNotificationRepository } from '@infrastructure/database/repositories/PrismaNotificationRepository';

export class NotificationService {
  private notificationRepository: PrismaNotificationRepository;

  constructor(prisma: PrismaClient) {
    this.notificationRepository = new PrismaNotificationRepository(prisma);
  }

  async send(
    userId: string,
    title: string,
    message: string,
    type: string,
    category: string,
    link?: string,
  ): Promise<Notification> {
    const notification = Notification.create({
      userId,
      type,
      title,
      message,
      metadata: { category, link },
    });

    return this.notificationRepository.create(notification);
  }

  async broadcast(
    role: string,
    title: string,
    message: string,
    type: string,
    category: string,
  ): Promise<number> {
    const users = await this.getUsersByRole(role);

    for (const userId of users) {
      const notification = Notification.create({
        userId,
        type,
        title,
        message,
        metadata: { category },
      });
      await this.notificationRepository.create(notification);
    }

    return users.length;
  }

  private async getUsersByRole(role: string): Promise<string[]> {
    const prisma = (this.notificationRepository as unknown as { prisma: PrismaClient }).prisma;
    const users = await prisma.user.findMany({
      where: { role: role as never, isActive: true },
      select: { id: true },
    });
    return users.map((u) => u.id);
  }
}
