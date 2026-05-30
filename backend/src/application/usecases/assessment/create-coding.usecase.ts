import { CreateCodingAssessmentDto, CreateCodingAssessmentDtoSchema } from '../../dto/coding.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAssessmentRepository {
  createCodingAssessment(data: unknown): Promise<unknown>;
}

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; collegeId: string } | null>;
}

export class CreateCodingUseCase {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private courseRepository: ICourseRepository,
  ) {}

  async execute(dto: CreateCodingAssessmentDto) {
    const parsed = CreateCodingAssessmentDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const course = await this.courseRepository.findById(parsed.data.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const totalPoints = parsed.data.testCases.reduce((sum, tc) => sum + tc.points, 0);

    return this.assessmentRepository.createCodingAssessment({
      ...parsed.data,
      totalPoints,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
    });
  }
}
