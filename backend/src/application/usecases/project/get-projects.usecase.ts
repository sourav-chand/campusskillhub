import { PaginationDto, PaginationDtoSchema, PaginatedResponseDto } from '../../dto/pagination.dto';
import { ProjectResponseDto } from '../../dto/project.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IProjectRepository {
  findAll(filter: {
    studentId?: string;
    courseId?: string;
    collegeId?: string;
    mentorId?: string;
    status?: string;
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ data: ProjectResponseDto[]; total: number }>;
}

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(filter: {
    studentId?: string;
    courseId?: string;
    collegeId?: string;
    mentorId?: string;
    status?: string;
  } & PaginationDto): Promise<PaginatedResponseDto<ProjectResponseDto>> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.projectRepository.findAll(filter);
    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
