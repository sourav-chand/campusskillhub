import { NotificationResponseDto } from '../../dto/notification.dto';
import { PaginatedResponseDto, PaginationDto, PaginationDtoSchema } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface INotificationRepository {
  findAll(filter: {
    userId: string;
    isRead?: boolean;
    type?: string;
    category?: string;
    page: number;
    limit: number;
  }): Promise<{ data: NotificationResponseDto[]; total: number }>;
  countUnread(userId: string): Promise<number>;
}

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(filter: {
    userId: string;
    isRead?: boolean;
    type?: string;
    category?: string;
  } & PaginationDto): Promise<{
    data: NotificationResponseDto[];
    meta: PaginatedResponseDto<NotificationResponseDto>['meta'];
    unreadCount: number;
  }> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.notificationRepository.findAll(filter);
    const unreadCount = await this.notificationRepository.countUnread(filter.userId);
    const paginated = new PaginatedResponseDto(data, total, paginationParsed.data);

    return {
      data: paginated.data,
      meta: paginated.meta,
      unreadCount,
    };
  }
}
