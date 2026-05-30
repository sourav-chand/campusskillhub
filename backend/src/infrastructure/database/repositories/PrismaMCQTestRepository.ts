import { PrismaClient } from '@prisma/client';
import { IMCQTestRepository } from '@domain/repositories/IMCQTestRepository';
import { MCQTest } from '@domain/entities/MCQTest';

export class PrismaMCQTestRepository implements IMCQTestRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    passingScore: number;
    totalQuestions: number;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
  }): MCQTest {
    return new MCQTest(
      data.id,
      data.title,
      data.description ?? '',
      data.courseId,
      null,
      null,
      data.duration,
      0,
      data.passingScore,
      data.totalQuestions,
      true,
      '',
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<MCQTest | null> {
    const test = await this.prisma.mCQTest.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });
    return test ? this.mapToEntity(test) : null;
  }

  async create(test: MCQTest): Promise<MCQTest> {
    const created = await this.prisma.mCQTest.create({
      data: {
        id: test.id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        passingScore: test.passingMarks,
        totalQuestions: test.totalQuestions,
        courseId: test.courseId,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<MCQTest>): Promise<MCQTest | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.passingMarks !== undefined) updateData.passingScore = data.passingMarks;
    if (data.totalQuestions !== undefined) updateData.totalQuestions = data.totalQuestions;

    const updated = await this.prisma.mCQTest.update({
      where: { id },
      data: updateData,
      include: { questions: { include: { options: true } } },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.mCQTest.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<MCQTest[]> {
    const tests = await this.prisma.mCQTest.findMany({
      include: { questions: { include: { options: true } } },
    });
    return tests.map((t) => this.mapToEntity(t));
  }

  async findByCourse(courseId: string): Promise<MCQTest[]> {
    const tests = await this.prisma.mCQTest.findMany({
      where: { courseId },
      include: { questions: { include: { options: true } } },
    });
    return tests.map((t) => this.mapToEntity(t));
  }

  async findByModule(moduleId: string): Promise<MCQTest[]> {
    return [];
  }
}
