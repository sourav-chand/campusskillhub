import { ApproveCollegeDto, ApproveCollegeDtoSchema } from '../../dto/college.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ICollegeRepository {
  findById(id: string): Promise<{ id: string; isApproved: boolean } | null>;
  update(id: string, data: unknown): Promise<unknown>;
}

export class ApproveCollegeUseCase {
  constructor(private collegeRepository: ICollegeRepository) {}

  async execute(collegeId: string, dto: ApproveCollegeDto) {
    const parsed = ApproveCollegeDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const college = await this.collegeRepository.findById(collegeId);
    if (!college) {
      throw new AppError('College not found', 404);
    }

    if (college.isApproved) {
      throw new AppError('College is already approved', 400);
    }

    return this.collegeRepository.update(collegeId, {
      isApproved: true,
      approvedAt: new Date(),
      approvedById: parsed.data.approvedById,
    });
  }
}
