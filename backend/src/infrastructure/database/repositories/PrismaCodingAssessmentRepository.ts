import { PrismaClient } from '@prisma/client';
import { ICodingAssessmentRepository } from '@domain/repositories/ICodingAssessmentRepository';
import { CodingAssessment } from '@domain/entities/CodingAssessment';

export class PrismaCodingAssessmentRepository implements ICodingAssessmentRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    language: string;
    problemStatement: string;
    testCases: string;
    passingScore: number;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
  }): CodingAssessment {
    return new CodingAssessment(
      data.id,
      data.title,
      data.description ?? '',
      data.courseId,
      null,
      null,
      data.language,
      data.problemStatement,
      null,
      null,
      null,
      null,
      data.testCases,
      'MEDIUM',
      true,
      '',
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<CodingAssessment | null> {
    const assessment = await this.prisma.codingAssessment.findUnique({ where: { id } });
    return assessment ? this.mapToEntity(assessment) : null;
  }

  async create(assessment: CodingAssessment): Promise<CodingAssessment> {
    const created = await this.prisma.codingAssessment.create({
      data: {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        duration: 60,
        language: assessment.language,
        problemStatement: assessment.problemStatement,
        testCases: assessment.testCases,
        passingScore: 50,
        courseId: assessment.courseId,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<CodingAssessment>): Promise<CodingAssessment | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.problemStatement !== undefined) updateData.problemStatement = data.problemStatement;
    if (data.testCases !== undefined) updateData.testCases = data.testCases;

    const updated = await this.prisma.codingAssessment.update({
      where: { id },
      data: updateData,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.codingAssessment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<CodingAssessment[]> {
    const assessments = await this.prisma.codingAssessment.findMany();
    return assessments.map((a) => this.mapToEntity(a));
  }

  async findByCourse(courseId: string): Promise<CodingAssessment[]> {
    const assessments = await this.prisma.codingAssessment.findMany({ where: { courseId } });
    return assessments.map((a) => this.mapToEntity(a));
  }

  async findByModule(moduleId: string): Promise<CodingAssessment[]> {
    return [];
  }
}
