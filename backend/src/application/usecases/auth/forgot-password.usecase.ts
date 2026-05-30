import { ForgotPasswordDto, ForgotPasswordDtoSchema } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';
import { generateVerificationToken } from '../../../shared/utils/helpers';
import { logger } from '../../../shared/utils/logger';

export interface IUserRepository {
  findByEmail(email: string): Promise<{ id: string; name: string; email: string } | null>;
  updateResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
}

export interface IEmailService {
  sendPasswordResetEmail(email: string, token: string, name: string): Promise<void>;
}

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const parsed = ForgotPasswordDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email } = parsed.data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.updateResetToken(user.id, resetToken, expiresAt);

    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken, user.name);
    } catch (error) {
      logger.error('Failed to send password reset email', { email, error });
      throw new AppError('Failed to send reset email', 500);
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }
}
