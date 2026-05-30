import { AppError } from '../../../shared/errors/AppError';

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; isPublished: boolean } | null>;
  update(id: string, data: unknown): Promise<unknown>;
}

export class PublishCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string, publish: boolean = true) {
    if (!id) {
      throw new AppError('Course ID is required', 400);
    }

    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    if (course.isPublished === publish) {
      throw new AppError(`Course is already ${publish ? 'published' : 'unpublished'}`, 400);
    }

    return this.courseRepository.update(id, { isPublished: publish });
  }
}
