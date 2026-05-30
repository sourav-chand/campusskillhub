import { PrismaClient } from '@prisma/client';
import { IAssignmentRepository } from '@domain/repositories/IAssignmentRepository';
import { Assignment } from '@domain/entities/Assignment';

export class PrismaAssignmentRepository implements IAssignmentRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    maxScore: number;
    passingScore: number;
    fileUrl: string | null;
    courseId: string;
    trainerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Assignment {
    return new Assignment(
      data.id,
      data.title,
      data.description,
      data.courseId,
      null,
      null,
      data.dueDate,
      data.maxScore,
      data.passingScore,
      data.fileUrl ? [data.fileUrl] : [],
      data.trainerId,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Assignment | null> {
    const assignment = await this.prisma.assignment.findUnique({ where: { id } });
    return assignment ? this.mapToEntity(assignment) : null;
  }

  async create(assignment: Assignment): Promise<Assignment> {
    const created = await this.prisma.assignment.create({
      data: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxScore: assignment.totalMarks,
        passingScore: assignment.passingMarks,
        fileUrl: assignment.attachments[0] ?? null,
        courseId: assignment.courseId,
        trainerId: assignment.createdBy,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Assignment>): Promise<Assignment | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.totalMarks !== undefined) updateData.maxScore = data.totalMarks;
    if (data.passingMarks !== undefined) updateData.passingScore = data.passingMarks;
    if (data.attachments !== undefined) updateData.fileUrl = data.attachments[0] ?? null;

    const updated = await this.prisma.assignment.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.assignment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany();
    return assignments.map((a) => this.mapToEntity(a));
  }

  async findByCourse(courseId: string): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany({ where: { courseId } });
    return assignments.map((a) => this.mapToEntity(a));
  }

  async findByModule(moduleId: string): Promise<Assignment[]> {
    return [];
  }

  async findByTrainer(trainerId: string): Promise<Assignment[]> {
    const assignments = await this.prisma.assignment.findMany({ where: { trainerId } });
    return assignments.map((a) => this.mapToEntity(a));
  }
}
