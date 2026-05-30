import { PrismaClient } from '@prisma/client';
import { ICodingSubmissionRepository } from '@domain/repositories/ICodingSubmissionRepository';
import { CodingSubmission } from '@domain/entities/CodingSubmission';

export class PrismaCodingSubmissionRepository implements ICodingSubmissionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    code: string;
    language: string;
    score: number | null;
    passed: boolean;
    testResults: string | null;
    studentId: string;
    assessmentId: string;
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }): CodingSubmission {
    const status = data.passed ? 'PASSED' : 'SUBMITTED';
    return new CodingSubmission(
      data.id,
      data.assessmentId,
      data.studentId,
      data.code,
      data.language,
      status,
      data.testResults,
      data.score,
      data.score,
      data.submittedAt,
      null,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<CodingSubmission | null> {
    const submission = await this.prisma.codingSubmission.findUnique({ where: { id } });
    return submission ? this.mapToEntity(submission) : null;
  }

  async create(submission: CodingSubmission): Promise<CodingSubmission> {
    const created = await this.prisma.codingSubmission.create({
      data: {
        id: submission.id,
        assessmentId: submission.assessmentId,
        studentId: submission.studentId,
        code: submission.code,
        language: submission.language,
        score: submission.obtainedMarks,
        passed: submission.status === 'PASSED',
        testResults: submission.testResults,
        submittedAt: submission.submittedAt ?? new Date(),
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<CodingSubmission>): Promise<CodingSubmission | null> {
    const updateData: Record<string, unknown> = {};
    if (data.code !== undefined) updateData.code = data.code;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.status !== undefined) updateData.passed = data.status === 'PASSED';
    if (data.testResults !== undefined) updateData.testResults = data.testResults;
    if (data.totalMarks !== undefined) updateData.score = data.totalMarks;
    if (data.obtainedMarks !== undefined) updateData.score = data.obtainedMarks;
    if (data.submittedAt !== undefined) updateData.submittedAt = data.submittedAt;

    const updated = await this.prisma.codingSubmission.update({
      where: { id },
      data: updateData,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.codingSubmission.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<CodingSubmission[]> {
    const submissions = await this.prisma.codingSubmission.findMany();
    return submissions.map((s) => this.mapToEntity(s));
  }

  async findByAssessment(assessmentId: string): Promise<CodingSubmission[]> {
    const submissions = await this.prisma.codingSubmission.findMany({ where: { assessmentId } });
    return submissions.map((s) => this.mapToEntity(s));
  }

  async findByStudent(studentId: string): Promise<CodingSubmission[]> {
    const submissions = await this.prisma.codingSubmission.findMany({ where: { studentId } });
    return submissions.map((s) => this.mapToEntity(s));
  }
}
