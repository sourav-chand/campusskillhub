import { PrismaClient } from '@prisma/client';
import { IAuditLogRepository } from '@domain/repositories/IAuditLogRepository';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ id: string; userId: string; action: string; entity: string; entityId: string | null; details: string | null; createdAt: Date }> {
    const log = await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
    return log;
  }

  async findByUser(userId: string): Promise<Array<{ id: string; userId: string; action: string; entity: string; entityId: string | null; details: string | null; ipAddress: string | null; userAgent: string | null; createdAt: Date }>> {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEntity(entity: string, entityId: string): Promise<Array<{ id: string; userId: string; action: string; entity: string; entityId: string | null; details: string | null; ipAddress: string | null; userAgent: string | null; createdAt: Date }>> {
    return this.prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Array<{ id: string; userId: string; action: string; entity: string; entityId: string | null; details: string | null; ipAddress: string | null; userAgent: string | null; createdAt: Date }>> {
    return this.prisma.auditLog.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
