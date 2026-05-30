import { PaginationDto, PaginationDtoSchema, PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAssignmentRepository {
  findAll(filter: {
    courseId?: string;
    studentId?: string;
    trainerId?: string;
    status?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ data: unknown[]; total: number }>;
}

export class ListAssignmentsUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) {}

  async execute(filter: {
    courseId?: string;
    studentId?: string;
    trainerId?: string;
    status?: string;
  } & PaginationDto): Promise<PaginatedResponseDto<unknown>> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.assignmentRepository.findAll(filter);
    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
