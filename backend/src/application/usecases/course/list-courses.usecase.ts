import { CourseFilterDto, CourseFilterDtoSchema, CourseResponseDto } from '../../dto/course.dto';
import { PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ICourseRepository {
  findAll(filter: CourseFilterDto): Promise<{ data: CourseResponseDto[]; total: number }>;
}

export class ListCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(filter: CourseFilterDto): Promise<PaginatedResponseDto<CourseResponseDto>> {
    const parsed = CourseFilterDtoSchema.safeParse(filter);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.courseRepository.findAll(parsed.data);
    return new PaginatedResponseDto(data, total, parsed.data);
  }
}
