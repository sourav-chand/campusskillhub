import { RefreshTokenDto, RefreshTokenDtoSchema } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ITokenService {
  verifyRefreshToken(token: string): Promise<{
    userId: string; email: string; role: string; collegeId?: string;
  }>;
  generateTokens(payload: {
    userId: string; email: string; role: string; collegeId?: string;
  }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }>;
}

export interface IRefreshTokenRepository {
  findToken(token: string): Promise<{ userId: string; expiresAt: Date } | null>;
  deleteToken(token: string): Promise<void>;
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
}

export class RefreshTokenUseCase {
  constructor(
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: RefreshTokenDto) {
    const parsed = RefreshTokenDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { refreshToken } = parsed.data;

    const storedToken = await this.refreshTokenRepository.findToken(refreshToken);
    if (!storedToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteToken(refreshToken);
      throw new AppError('Refresh token has expired', 401);
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    await this.refreshTokenRepository.deleteToken(refreshToken);

    const tokens = await this.tokenService.generateTokens({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      collegeId: payload.collegeId,
    });

    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepository.save(payload.userId, tokens.refreshToken, refreshTokenExpiry);

    return tokens;
  }
}
