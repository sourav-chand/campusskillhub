import { PrismaClient } from '@prisma/client';
import { ISubscriptionRepository } from '@domain/repositories/ISubscriptionRepository';
import { Subscription } from '@domain/entities/Subscription';

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    plan: string;
    price: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    paymentId: string | null;
    collegeId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Subscription {
    return new Subscription(
      data.id,
      data.collegeId,
      data.plan,
      data.startDate,
      data.endDate,
      data.price,
      data.isActive ? 'ACTIVE' : 'INACTIVE',
      data.paymentId,
      null,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({ where: { id } });
    return subscription ? this.mapToEntity(subscription) : null;
  }

  async create(subscription: Subscription): Promise<Subscription> {
    const created = await this.prisma.subscription.create({
      data: {
        id: subscription.id,
        plan: subscription.planType,
        price: subscription.amount,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: subscription.status === 'ACTIVE',
        paymentId: subscription.paymentId,
        collegeId: subscription.collegeId,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Subscription>): Promise<Subscription | null> {
    const updateData: Record<string, unknown> = {};
    if (data.planType !== undefined) updateData.plan = data.planType;
    if (data.amount !== undefined) updateData.price = data.amount;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.status !== undefined) updateData.isActive = data.status === 'ACTIVE';
    if (data.paymentId !== undefined) updateData.paymentId = data.paymentId;

    const updated = await this.prisma.subscription.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.subscription.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Subscription[]> {
    const subscriptions = await this.prisma.subscription.findMany();
    return subscriptions.map((s) => this.mapToEntity(s));
  }

  async findByCollege(collegeId: string): Promise<Subscription[]> {
    const subscriptions = await this.prisma.subscription.findMany({ where: { collegeId } });
    return subscriptions.map((s) => this.mapToEntity(s));
  }

  async findActive(collegeId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { collegeId, isActive: true, endDate: { gte: new Date() } },
      orderBy: { startDate: 'desc' },
    });
    return subscription ? this.mapToEntity(subscription) : null;
  }

  async getRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.subscription.aggregate({
      _sum: { price: true },
      where: {
        startDate: { gte: startDate },
        endDate: { lte: endDate },
        isActive: true,
      },
    });
    return result._sum.price ?? 0;
  }
}
