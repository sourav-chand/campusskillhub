import { CreateEnrollmentDto, CreateEnrollmentDtoSchema } from '../../dto/enrollment.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IEnrollmentRepository {
  findExisting(courseId: string, studentId: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; isPublished: boolean; collegeId: string } | null>;
}

export interface IUserRepository {
  findById(id: string): Promise<{ id: string; role: string } | null>;
}

export class CreateEnrollmentUseCase {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateEnrollmentDto) {
    const parsed = CreateEnrollmentDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { courseId, studentId, collegeId } = parsed.data;

    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (!course.isPublished) {
      throw new AppError('Course is not published', 400);
    }

    const student = await this.userRepository.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new AppError('Invalid student', 400);
    }

    const existing = await this.enrollmentRepository.findExisting(courseId, studentId);
    if (existing) {
      throw new AppError('Student is already enrolled in this course', 409);
    }

    return this.enrollmentRepository.create({
      courseId,
      studentId,
      collegeId,
      progress: 0,
      status: 'active',
      startedAt: new Date(),
    });
  }
}
