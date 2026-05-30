import { AppError } from '../../../shared/errors/AppError';

export interface IRefreshTokenRepository {
  deleteToken(token: string): Promise<void>;
  deleteAllUserTokens(userId: string): Promise<void>;
}

export class LogoutUseCase {
  constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(params: { refreshToken?: string; userId?: string }): Promise<{ message: string }> {
    if (params.refreshToken) {
      await this.refreshTokenRepository.deleteToken(params.refreshToken);
    } else if (params.userId) {
      await this.refreshTokenRepository.deleteAllUserTokens(params.userId);
    } else {
      throw new AppError('Either refreshToken or userId is required', 400);
    }

    return { message: 'Logged out successfully' };
  }
}
