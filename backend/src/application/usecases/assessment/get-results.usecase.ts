import { AppError } from '../../../shared/errors/AppError';
import { PaginatedResponseDto, PaginationDtoSchema } from '../../dto/pagination.dto';

export interface IAssessmentRepository {
  getResults(filter: {
    testId?: string;
    studentId?: string;
    courseId?: string;
    type?: 'mcq' | 'coding';
    page: number;
    limit: number;
  }): Promise<{ data: unknown[]; total: number }>;
}

export class GetResultsUseCase {
  constructor(private assessmentRepository: IAssessmentRepository) {}

  async execute(filter: {
    testId?: string;
    studentId?: string;
    courseId?: string;
    type?: 'mcq' | 'coding';
    page?: number;
    limit?: number;
  }) {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.assessmentRepository.getResults(filter as Parameters<IAssessmentRepository['getResults']>[0]);
    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
