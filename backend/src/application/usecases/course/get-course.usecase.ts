import { AppError } from '../../../shared/errors/AppError';
import { CourseResponseDto } from '../../dto/course.dto';

export interface ICourseRepository {
  findByIdWithDetails(id: string): Promise<CourseResponseDto | null>;
}

export class GetCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(id: string): Promise<CourseResponseDto> {
    if (!id) {
      throw new AppError('Course ID is required', 400);
    }

    const course = await this.courseRepository.findByIdWithDetails(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }
}
