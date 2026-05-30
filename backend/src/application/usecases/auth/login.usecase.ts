import { LoginDto, LoginDtoSchema, LoginResponseDto } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IUserRepository {
  findByEmail(email: string): Promise<{
    id: string; email: string; firstName: string; lastName: string; role: string;
    password: string; collegeId?: string; isActive: boolean;
    isEmailVerified: boolean;
  } | null>;
}

export interface IPasswordHasher {
  compare(password: string, hash: string): Promise<boolean>;
}

export interface ITokenService {
  generateTokens(payload: {
    userId: string; email: string; role: string; collegeId?: string;
  }): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }>;
}

export interface IRefreshTokenRepository {
  save(userId: string, token: string, expiresAt: Date): Promise<void>;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const parsed = LoginDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = await this.tokenService.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
    });

    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepository.save(user.id, tokens.refreshToken, refreshTokenExpiry);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        collegeId: user.collegeId,
      },
      tokens,
    };
  }
}
