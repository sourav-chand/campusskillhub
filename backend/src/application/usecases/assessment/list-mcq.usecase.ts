import { PaginationDto, PaginationDtoSchema, PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';
import { MCQTest } from '@domain/entities/MCQTest';

export interface IMCQTestRepository {
  findAll(): Promise<MCQTest[]>;
}

export class ListMCQTestsUseCase {
  constructor(private mcqTestRepository: IMCQTestRepository) {}

  async execute(filter: PaginationDto & { course?: string }): Promise<PaginatedResponseDto<MCQTest>> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const allTests = await this.mcqTestRepository.findAll();
    const filtered = filter.course
      ? allTests.filter((t) => t.courseId === filter.course)
      : allTests;

    const total = filtered.length;
    const start = (paginationParsed.data.page - 1) * paginationParsed.data.limit;
    const data = filtered.slice(start, start + paginationParsed.data.limit);

    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
