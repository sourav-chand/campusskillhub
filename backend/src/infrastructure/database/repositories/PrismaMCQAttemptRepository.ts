import { PrismaClient } from '@prisma/client';
import { IMCQAttemptRepository } from '@domain/repositories/IMCQAttemptRepository';
import { MCQAttempt } from '@domain/entities/MCQAttempt';
import { MCQAnswer } from '@domain/entities/MCQAnswer';

interface MCQAttemptWithAnswers {
  id: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date | null;
  studentId: string;
  testId: string;
  createdAt: Date;
  updatedAt: Date;
  answers: Array<{
    id: string;
    attemptId: string;
    questionId: string;
    optionId: string | null;
    isCorrect: boolean;
  }>;
}

export class PrismaMCQAttemptRepository implements IMCQAttemptRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: MCQAttemptWithAnswers): MCQAttempt {
    const answers = data.answers.map(
      (a) =>
        new MCQAnswer(
          a.id,
          a.attemptId,
          a.questionId,
          a.optionId ?? '',
          a.isCorrect,
          a.isCorrect ? 1 : 0,
        ),
    );

    const totalMarks = data.totalMarks;
    const obtainedMarks = data.score;
    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    return new MCQAttempt(
      data.id,
      data.testId,
      data.studentId,
      data.startedAt,
      data.completedAt,
      totalMarks,
      obtainedMarks,
      percentage,
      data.passed,
      answers,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<MCQAttempt | null> {
    const attempt = await this.prisma.mCQAttempt.findUnique({
      where: { id },
      include: { answers: true },
    });
    return attempt ? this.mapToEntity(attempt as MCQAttemptWithAnswers) : null;
  }

  async create(attempt: MCQAttempt): Promise<MCQAttempt> {
    const created = await this.prisma.mCQAttempt.create({
      data: {
        id: attempt.id,
        testId: attempt.testId,
        studentId: attempt.studentId,
        startedAt: attempt.startedAt,
        completedAt: attempt.submittedAt,
        score: attempt.obtainedMarks,
        totalMarks: attempt.totalMarks,
        passed: attempt.isPassed,
        answers: {
          create: attempt.answers.map((a) => ({
            id: a.id,
            questionId: a.questionId,
            optionId: a.selectedOptionId || undefined,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: { answers: true },
    });
    return this.mapToEntity(created as MCQAttemptWithAnswers);
  }

  async update(id: string, data: Partial<MCQAttempt>): Promise<MCQAttempt | null> {
    const updateData: Record<string, unknown> = {};
    if (data.submittedAt !== undefined) updateData.completedAt = data.submittedAt;
    if (data.obtainedMarks !== undefined) updateData.score = data.obtainedMarks;
    if (data.totalMarks !== undefined) updateData.totalMarks = data.totalMarks;
    if (data.isPassed !== undefined) updateData.passed = data.isPassed;

    const updated = await this.prisma.mCQAttempt.update({
      where: { id },
      data: updateData,
      include: { answers: true },
    });
    return this.mapToEntity(updated as MCQAttemptWithAnswers);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.mCQAttempt.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<MCQAttempt[]> {
    const attempts = await this.prisma.mCQAttempt.findMany({
      include: { answers: true },
    });
    return attempts.map((a) => this.mapToEntity(a as MCQAttemptWithAnswers));
  }

  async findByTest(testId: string): Promise<MCQAttempt[]> {
    const attempts = await this.prisma.mCQAttempt.findMany({
      where: { testId },
      include: { answers: true },
    });
    return attempts.map((a) => this.mapToEntity(a as MCQAttemptWithAnswers));
  }

  async findByStudent(studentId: string): Promise<MCQAttempt[]> {
    const attempts = await this.prisma.mCQAttempt.findMany({
      where: { studentId },
      include: { answers: true },
    });
    return attempts.map((a) => this.mapToEntity(a as MCQAttemptWithAnswers));
  }

  async findByStudentAndTest(studentId: string, testId: string): Promise<MCQAttempt[]> {
    const attempts = await this.prisma.mCQAttempt.findMany({
      where: { studentId, testId },
      include: { answers: true },
    });
    return attempts.map((a) => this.mapToEntity(a as MCQAttemptWithAnswers));
  }
}
