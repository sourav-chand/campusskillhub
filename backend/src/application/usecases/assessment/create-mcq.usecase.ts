import { CreateMCQTestDto, CreateMCQTestDtoSchema } from '../../dto/mcq.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAssessmentRepository {
  createMCQTest(data: unknown): Promise<unknown>;
}

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; collegeId: string } | null>;
}

export class CreateMCQUseCase {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private courseRepository: ICourseRepository,
  ) {}

  async execute(dto: CreateMCQTestDto) {
    const parsed = CreateMCQTestDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const course = await this.courseRepository.findById(parsed.data.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    for (const question of parsed.data.questions) {
      const correctCount = question.options.filter((o) => o.isCorrect).length;
      if (question.questionType === 'single' && correctCount !== 1) {
        throw new AppError(
          `Question "${question.questionText}" must have exactly one correct answer for single-choice type`,
          400,
        );
      }
      if (correctCount === 0) {
        throw new AppError(
          `Question "${question.questionText}" must have at least one correct answer`,
          400,
        );
      }
    }

    const totalPoints = parsed.data.questions.reduce((sum, q) => sum + q.points, 0);

    return this.assessmentRepository.createMCQTest({
      ...parsed.data,
      totalPoints,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
    });
  }
}
