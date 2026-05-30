import { CreateProjectDto, CreateProjectDtoSchema } from '../../dto/project.dto';
import { AppError } from '../../../shared/errors/AppError';
import { generateSlug } from '../../../shared/utils/helpers';

export interface IProjectRepository {
  create(data: unknown): Promise<unknown>;
}

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; collegeId: string } | null>;
}

export interface IUserRepository {
  findById(id: string): Promise<{ id: string; role: string } | null>;
}

export class CreateProjectUseCase {
  constructor(
    private projectRepository: IProjectRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateProjectDto) {
    const parsed = CreateProjectDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const course = await this.courseRepository.findById(parsed.data.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const student = await this.userRepository.findById(parsed.data.studentId);
    if (!student || student.role !== 'student') {
      throw new AppError('Invalid student', 400);
    }

    if (parsed.data.mentorId) {
      const mentor = await this.userRepository.findById(parsed.data.mentorId);
      if (!mentor) {
        throw new AppError('Mentor not found', 404);
      }
    }

    const slug = generateSlug(parsed.data.title);

    return this.projectRepository.create({
      ...parsed.data,
      slug,
      status: 'not_started',
      progress: 0,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    });
  }
}
