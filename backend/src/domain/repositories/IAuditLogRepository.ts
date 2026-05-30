export interface IAuditLogRepository {
  create(data: {
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    metadata?: Record<string, unknown>;
  }): Promise<unknown>;
  findByUser(userId: string): Promise<unknown[]>;
  findByEntity(entity: string, entityId: string): Promise<unknown[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<unknown[]>;
}
