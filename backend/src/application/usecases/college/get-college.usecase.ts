import { AppError } from '../../../shared/errors/AppError';
import { CollegeResponseDto } from '../../dto/college.dto';

export interface ICollegeRepository {
  findByIdWithDetails(id: string): Promise<CollegeResponseDto | null>;
}

export class GetCollegeUseCase {
  constructor(private collegeRepository: ICollegeRepository) {}

  async execute(id: string): Promise<CollegeResponseDto> {
    if (!id) {
      throw new AppError('College ID is required', 400);
    }

    const college = await this.collegeRepository.findByIdWithDetails(id);
    if (!college) {
      throw new AppError('College not found', 404);
    }

    return college;
  }
}
