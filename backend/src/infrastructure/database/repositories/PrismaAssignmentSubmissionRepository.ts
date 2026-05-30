import { PrismaClient, SubmissionStatus } from '@prisma/client';
import { IAssignmentSubmissionRepository } from '@domain/repositories/IAssignmentSubmissionRepository';
import { AssignmentSubmission } from '@domain/entities/AssignmentSubmission';

export class PrismaAssignmentSubmissionRepository implements IAssignmentSubmissionRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    assignmentId: string;
    studentId: string;
    content: string | null;
    fileUrl: string | null;
    score: number | null;
    feedback: string | null;
    status: SubmissionStatus;
    submittedAt: Date;
    gradedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): AssignmentSubmission {
    return new AssignmentSubmission(
      data.id,
      data.assignmentId,
      data.studentId,
      data.content ?? '',
      data.fileUrl ? [data.fileUrl] : [],
      data.score,
      data.feedback,
      data.status as import('@domain/value-objects/enums').SubmissionStatus,
      data.submittedAt,
      data.gradedAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<AssignmentSubmission | null> {
    const submission = await this.prisma.assignmentSubmission.findUnique({ where: { id } });
    return submission ? this.mapToEntity(submission) : null;
  }

  async create(submission: AssignmentSubmission): Promise<AssignmentSubmission> {
    const created = await this.prisma.assignmentSubmission.create({
      data: {
        id: submission.id,
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
        content: submission.content,
        fileUrl: submission.attachments[0] ?? null,
        score: submission.marks,
        feedback: submission.feedback,
        status: submission.status as SubmissionStatus,
        submittedAt: submission.submittedAt ?? new Date(),
        gradedAt: submission.gradedAt,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<AssignmentSubmission>): Promise<AssignmentSubmission | null> {
    const updateData: Record<string, unknown> = {};
    if (data.content !== undefined) updateData.content = data.content;
    if (data.attachments !== undefined) updateData.fileUrl = data.attachments[0] ?? null;
    if (data.marks !== undefined) updateData.score = data.marks;
    if (data.feedback !== undefined) updateData.feedback = data.feedback;
    if (data.status !== undefined) updateData.status = data.status as SubmissionStatus;
    if (data.gradedAt !== undefined) updateData.gradedAt = data.gradedAt;

    const updated = await this.prisma.assignmentSubmission.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.assignmentSubmission.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<AssignmentSubmission[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany();
    return submissions.map((s) => this.mapToEntity(s));
  }

  async findByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({ where: { assignmentId } });
    return submissions.map((s) => this.mapToEntity(s));
  }

  async findByStudent(studentId: string): Promise<AssignmentSubmission[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({ where: { studentId } });
    return submissions.map((s) => this.mapToEntity(s));
  }

  async findByStatus(status: import('@domain/value-objects/enums').SubmissionStatus): Promise<AssignmentSubmission[]> {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { status: status as unknown as SubmissionStatus },
    });
    return submissions.map((s) => this.mapToEntity(s));
  }
}
