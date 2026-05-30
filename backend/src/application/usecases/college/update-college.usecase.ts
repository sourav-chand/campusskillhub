import { UpdateCollegeDto, UpdateCollegeDtoSchema } from '../../dto/college.dto';
import { AppError } from '../../../shared/errors/AppError';
import { generateSlug } from '../../../shared/utils/helpers';

export interface ICollegeRepository {
  findById(id: string): Promise<{ id: string; name: string } | null>;
  update(id: string, data: unknown): Promise<unknown>;
}

export class UpdateCollegeUseCase {
  constructor(private collegeRepository: ICollegeRepository) {}

  async execute(id: string, dto: UpdateCollegeDto) {
    const parsed = UpdateCollegeDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const college = await this.collegeRepository.findById(id);
    if (!college) {
      throw new AppError('College not found', 404);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.name) {
      updateData.slug = generateSlug(parsed.data.name);
    }

    return this.collegeRepository.update(id, updateData);
  }
}
