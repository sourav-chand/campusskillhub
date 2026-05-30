import { VerifyEmailDto, VerifyEmailDtoSchema } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IUserRepository {
  findByEmailVerificationToken(token: string): Promise<{ id: string } | null>;
  markEmailAsVerified(userId: string): Promise<void>;
}

export class VerifyEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string }> {
    const parsed = VerifyEmailDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { token } = parsed.data;

    const user = await this.userRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    await this.userRepository.markEmailAsVerified(user.id);

    return { message: 'Email verified successfully' };
  }
}
