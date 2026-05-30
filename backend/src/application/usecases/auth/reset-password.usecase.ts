import { ResetPasswordDto, ResetPasswordDtoSchema } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IUserRepository {
  findByResetToken(token: string): Promise<{
    id: string; email: string; resetTokenExpires: Date;
  } | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  clearResetToken(userId: string): Promise<void>;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export class ResetPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<{ message: string }> {
    const parsed = ResetPasswordDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { token, password } = parsed.data;

    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    if (user.resetTokenExpires < new Date()) {
      throw new AppError('Reset token has expired', 400);
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userRepository.clearResetToken(user.id);

    return { message: 'Password has been reset successfully' };
  }
}
