import { CreateAssignmentDto, CreateAssignmentDtoSchema } from '../../dto/assignment.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAssignmentRepository {
  create(data: unknown): Promise<unknown>;
}

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; collegeId: string } | null>;
}

export class CreateAssignmentUseCase {
  constructor(
    private assignmentRepository: IAssignmentRepository,
    private courseRepository: ICourseRepository,
  ) {}

  async execute(dto: CreateAssignmentDto) {
    const parsed = CreateAssignmentDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const course = await this.courseRepository.findById(parsed.data.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (new Date(parsed.data.dueDate) <= new Date()) {
      throw new AppError('Due date must be in the future', 400);
    }

    return this.assignmentRepository.create({
      ...parsed.data,
      dueDate: new Date(parsed.data.dueDate),
    });
  }
}
