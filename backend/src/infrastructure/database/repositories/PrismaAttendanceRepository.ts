import { PrismaClient, AttendanceStatus } from '@prisma/client';
import { IAttendanceRepository } from '@domain/repositories/IAttendanceRepository';
import { Attendance } from '@domain/entities/Attendance';

export class PrismaAttendanceRepository implements IAttendanceRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    studentId: string;
    liveClassId: string | null;
    date: Date;
    status: AttendanceStatus;
    markedBy: string;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Attendance {
    return new Attendance(
      data.id,
      data.studentId,
      data.liveClassId ?? '',
      data.date,
      data.status as import('@domain/value-objects/enums').AttendanceStatus,
      data.markedBy,
      data.remarks,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Attendance | null> {
    const attendance = await this.prisma.attendance.findUnique({ where: { id } });
    return attendance ? this.mapToEntity(attendance) : null;
  }

  async create(attendance: Attendance): Promise<Attendance> {
    const created = await this.prisma.attendance.create({
      data: {
        id: attendance.id,
        studentId: attendance.studentId,
        liveClassId: attendance.liveClassId,
        date: attendance.date,
        status: attendance.status as AttendanceStatus,
        markedBy: attendance.markedBy,
        remarks: attendance.remarks,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Attendance>): Promise<Attendance | null> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status as AttendanceStatus;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    const updated = await this.prisma.attendance.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.attendance.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Attendance[]> {
    const records = await this.prisma.attendance.findMany();
    return records.map((a) => this.mapToEntity(a));
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    const records = await this.prisma.attendance.findMany({ where: { studentId } });
    return records.map((a) => this.mapToEntity(a));
  }

  async findByDate(date: Date): Promise<Attendance[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await this.prisma.attendance.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay } },
    });
    return records.map((a) => this.mapToEntity(a));
  }

  async findByClass(liveClassId: string): Promise<Attendance[]> {
    const records = await this.prisma.attendance.findMany({ where: { liveClassId } });
    return records.map((a) => this.mapToEntity(a));
  }

  async getMonthlyReport(studentId: string, year: number, month: number): Promise<Attendance[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await this.prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startDate, lte: endDate },
      },
    });
    return records.map((a) => this.mapToEntity(a));
  }
}
