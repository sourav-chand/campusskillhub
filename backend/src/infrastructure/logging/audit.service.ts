import { PrismaClient } from '@prisma/client';
import { PrismaAuditLogRepository } from '@infrastructure/database/repositories/PrismaAuditLogRepository';

export class AuditService {
  private auditLogRepository: PrismaAuditLogRepository;

  constructor(prisma: PrismaClient) {
    this.auditLogRepository = new PrismaAuditLogRepository(prisma);
  }

  async log(
    action: string,
    entity: string,
    entityId: string,
    userId: string,
    details?: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const prisma = (this.auditLogRepository as unknown as { prisma: PrismaClient }).prisma;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : null,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      },
    });
  }
}
