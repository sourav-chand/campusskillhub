import { SubscriptionResponseDto } from '../../dto/subscription.dto';
import { PaginatedResponseDto, PaginationDto, PaginationDtoSchema } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ISubscriptionRepository {
  findAll(filter: {
    collegeId?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ data: SubscriptionResponseDto[]; total: number }>;
}

export class GetSubscriptionsUseCase {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async execute(filter: {
    collegeId?: string;
    status?: string;
  } & PaginationDto): Promise<PaginatedResponseDto<SubscriptionResponseDto>> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.subscriptionRepository.findAll(filter);
    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
