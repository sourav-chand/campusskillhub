import { EnrollmentResponseDto } from '../../dto/enrollment.dto';
import { PaginatedResponseDto, PaginationDto, PaginationDtoSchema } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IEnrollmentRepository {
  findAll(filter: {
    studentId?: string;
    courseId?: string;
    collegeId?: string;
    status?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ data: EnrollmentResponseDto[]; total: number }>;
}

export class GetEnrollmentsUseCase {
  constructor(private enrollmentRepository: IEnrollmentRepository) {}

  async execute(filter: {
    studentId?: string;
    courseId?: string;
    collegeId?: string;
    status?: string;
  } & PaginationDto): Promise<PaginatedResponseDto<EnrollmentResponseDto>> {
    const parsed = PaginationDtoSchema.safeParse(filter);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.enrollmentRepository.findAll(filter);
    return new PaginatedResponseDto(data, total, parsed.data);
  }
}
