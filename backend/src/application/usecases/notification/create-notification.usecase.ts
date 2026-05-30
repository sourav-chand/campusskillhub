import { CreateNotificationDto, CreateNotificationDtoSchema } from '../../dto/notification.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface INotificationRepository {
  create(data: unknown): Promise<unknown>;
}

export interface IUserRepository {
  findById(id: string): Promise<{ id: string } | null>;
}

export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateNotificationDto) {
    const parsed = CreateNotificationDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const user = await this.userRepository.findById(parsed.data.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.notificationRepository.create({
      ...parsed.data,
      isRead: false,
    });
  }
}
