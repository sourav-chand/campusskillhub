import { AppError } from '../../../shared/errors/AppError';

export interface ICertificateRepository {
  findExisting(studentId: string, courseId: string): Promise<unknown>;
  generateCertificateNumber(): Promise<string>;
  create(data: unknown): Promise<unknown>;
}

export interface IEnrollmentRepository {
  findById(id: string): Promise<{
    id: string; studentId: string; courseId: string;
    collegeId: string; status: string; score?: number;
    completedAt?: Date;
  } | null>;
  findStudentCourse(studentId: string, courseId: string): Promise<{
    id: string; status: string; score?: number; completedAt?: Date;
  } | null>;
}

export class GenerateCertificateUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(params: { studentId: string; courseId: string; enrollmentId?: string }) {
    const { studentId, courseId, enrollmentId } = params;

    if (!studentId || !courseId) {
      throw new AppError('Student ID and Course ID are required', 400);
    }

    let enrollment;

    if (enrollmentId) {
      enrollment = await this.enrollmentRepository.findById(enrollmentId);
    } else {
      enrollment = await this.enrollmentRepository.findStudentCourse(studentId, courseId);
    }

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    if (enrollment.status !== 'completed' && enrollment.status !== 'active') {
      throw new AppError('Course must be completed to generate certificate', 400);
    }

    const existingCertificate = await this.certificateRepository.findExisting(studentId, courseId);
    if (existingCertificate) {
      throw new AppError('Certificate already generated for this course', 409);
    }

    const certificateNumber = await this.certificateRepository.generateCertificateNumber();

    return this.certificateRepository.create({
      certificateNumber,
      studentId,
      courseId,
      collegeId: enrollment.collegeId,
      issueDate: new Date(),
      grade: enrollment.score ? getGrade(enrollment.score) : undefined,
      score: enrollment.score,
      isValid: true,
    });
  }
}

const getGrade = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  return 'D';
};
