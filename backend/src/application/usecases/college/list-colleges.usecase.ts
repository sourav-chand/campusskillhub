import { CollegeFilterDto, CollegeFilterDtoSchema, CollegeResponseDto } from '../../dto/college.dto';
import { PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ICollegeRepository {
  findAll(filter: CollegeFilterDto): Promise<{ data: CollegeResponseDto[]; total: number }>;
}

export class ListCollegesUseCase {
  constructor(private collegeRepository: ICollegeRepository) {}

  async execute(filter: CollegeFilterDto): Promise<PaginatedResponseDto<CollegeResponseDto>> {
    const parsed = CollegeFilterDtoSchema.safeParse(filter);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.collegeRepository.findAll(parsed.data);
    return new PaginatedResponseDto(data, total, parsed.data);
  }
}
