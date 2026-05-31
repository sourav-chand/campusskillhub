import { CreateCourseDto, CreateCourseDtoSchema } from '../../dto/course.dto';
import { AppError } from '../../../shared/errors/AppError';
import { generateSlug } from '../../../shared/utils/helpers';

export interface ICourseRepository {
  findBySlug(slug: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface ICollegeRepository {
  findById(id: string): Promise<unknown>;
}

export class CreateCourseUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private collegeRepository: ICollegeRepository,
  ) {}

  async execute(dto: CreateCourseDto) {
    const parsed = CreateCourseDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { collegeId, trainerId } = parsed.data;

    if (collegeId) {
      const college = await this.collegeRepository.findById(collegeId);
      if (!college) {
        throw new AppError('College not found', 404);
      }
    }

    if (!trainerId) {
      throw new AppError('Trainer ID is required', 400);
    }

    const slug = generateSlug(parsed.data.title);
    const existingSlug = await this.courseRepository.findBySlug(slug);
    if (existingSlug) {
      throw new AppError('A course with this title already exists', 409);
    }

    return this.courseRepository.create({
      ...parsed.data,
      slug,
      isPublished: false,
    });
  }
}
