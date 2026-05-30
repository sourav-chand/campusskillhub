import { PrismaClient } from '@prisma/client';
import { IEnrollmentRepository } from '@domain/repositories/IEnrollmentRepository';
import { Enrollment } from '@domain/entities/Enrollment';

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    studentId: string;
    courseId: string;
    progress: number;
    completedModules: number;
    completedLessons: number;
    startedAt: Date;
    completedAt: Date | null;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Enrollment {
    return new Enrollment(
      data.id,
      data.studentId,
      data.courseId,
      data.progress,
      data.completedModules,
      data.completedLessons,
      data.startedAt,
      data.completedAt,
      data.isCompleted,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Enrollment | null> {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id } });
    return enrollment ? this.mapToEntity(enrollment) : null;
  }

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const created = await this.prisma.enrollment.create({
      data: {
        id: enrollment.id,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        completedModules: enrollment.completedModules,
        completedLessons: enrollment.completedLessons,
        startedAt: enrollment.startedAt,
        completedAt: enrollment.completedAt,
        isCompleted: enrollment.isCompleted,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Enrollment>): Promise<Enrollment | null> {
    const updateData: Record<string, unknown> = {};
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.completedModules !== undefined) updateData.completedModules = data.completedModules;
    if (data.completedLessons !== undefined) updateData.completedLessons = data.completedLessons;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;
    if (data.isCompleted !== undefined) updateData.isCompleted = data.isCompleted;

    const updated = await this.prisma.enrollment.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.enrollment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany();
    return enrollments.map((e) => this.mapToEntity(e));
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({ where: { studentId } });
    return enrollments.map((e) => this.mapToEntity(e));
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    const enrollments = await this.prisma.enrollment.findMany({ where: { courseId } });
    return enrollments.map((e) => this.mapToEntity(e));
  }

  async countByCourse(courseId: string): Promise<number> {
    return this.prisma.enrollment.count({ where: { courseId } });
  }

  async getProgress(studentId: string, courseId: string): Promise<number> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
      select: { progress: true },
    });
    return enrollment?.progress ?? 0;
  }
}
