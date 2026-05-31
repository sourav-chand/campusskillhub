import { PaginationDto, PaginationDtoSchema, PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';
import { CodingAssessment } from '@domain/entities/CodingAssessment';

export interface ICodingAssessmentRepository {
  findAll(): Promise<CodingAssessment[]>;
}

export class ListCodingAssessmentsUseCase {
  constructor(private codingAssessmentRepository: ICodingAssessmentRepository) {}

  async execute(filter: PaginationDto & { course?: string }): Promise<PaginatedResponseDto<CodingAssessment>> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const allAssessments = await this.codingAssessmentRepository.findAll();
    const filtered = filter.course
      ? allAssessments.filter((a) => a.courseId === filter.course)
      : allAssessments;

    const total = filtered.length;
    const start = (paginationParsed.data.page - 1) * paginationParsed.data.limit;
    const data = filtered.slice(start, start + paginationParsed.data.limit);

    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
