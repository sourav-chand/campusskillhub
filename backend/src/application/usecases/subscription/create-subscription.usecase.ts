import { CreateSubscriptionDto, CreateSubscriptionDtoSchema } from '../../dto/subscription.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ISubscriptionRepository {
  findActiveByCollege(collegeId: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface ICollegeRepository {
  findById(id: string): Promise<{ id: string; isApproved: boolean } | null>;
}

export class CreateSubscriptionUseCase {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private collegeRepository: ICollegeRepository,
  ) {}

  async execute(dto: CreateSubscriptionDto) {
    const parsed = CreateSubscriptionDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const college = await this.collegeRepository.findById(parsed.data.collegeId);
    if (!college) {
      throw new AppError('College not found', 404);
    }

    const activeSubscription = await this.subscriptionRepository.findActiveByCollege(
      parsed.data.collegeId,
    );
    if (activeSubscription) {
      throw new AppError('College already has an active subscription', 409);
    }

    const startDate = new Date(parsed.data.startDate);
    const endDate = new Date(parsed.data.endDate);

    if (endDate <= startDate) {
      throw new AppError('End date must be after start date', 400);
    }

    return this.subscriptionRepository.create({
      ...parsed.data,
      startDate,
      endDate,
      status: 'active',
      autoRenew: false,
    });
  }
}
