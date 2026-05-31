import { CollegeFilterDto, CollegeFilterDtoSchema } from '../../dto/college.dto';
import { PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';
import { ICollegeRepository as DomainCollegeRepository } from '@domain/repositories/ICollegeRepository';

export class ListCollegesUseCase {
  constructor(private collegeRepository: DomainCollegeRepository) {}

  async execute(filter: CollegeFilterDto): Promise<PaginatedResponseDto<Record<string, unknown>>> {
    const parsed = CollegeFilterDtoSchema.safeParse(filter);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const colleges = await this.collegeRepository.findAll();
    const total = colleges.length;
    const data = colleges.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      address: c.address,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      phone: c.phone,
      email: c.email,
      website: c.website,
      logo: c.logo,
      isActive: String(c.status) === 'APPROVED',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
    return new PaginatedResponseDto(data, total, parsed.data);
  }
}
