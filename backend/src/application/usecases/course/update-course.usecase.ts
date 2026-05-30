import { UpdateCourseDto, UpdateCourseDtoSchema } from '../../dto/course.dto';
import { AppError } from '../../../shared/errors/AppError';
import { generateSlug } from '../../../shared/utils/helpers';

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; title: string; collegeId: string } | null>;
  update(id: string, data: unknown): Promise<unknown>;
}

export class UpdateCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string, dto: UpdateCourseDto) {
    const parsed = UpdateCourseDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.title) {
      updateData.slug = generateSlug(parsed.data.title);
    }

    return this.courseRepository.update(id, updateData);
  }
}
