import { RegisterDto, RegisterDtoSchema } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';
import { logger } from '../../../shared/utils/logger';
import { generateVerificationToken } from '../../../shared/utils/helpers';

export interface IUserRepository {
  findByEmail(email: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface ICollegeRepository {
  findById(id: string): Promise<unknown>;
}

export interface IEmailService {
  sendVerificationEmail(email: string, token: string, name: string): Promise<void>;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private collegeRepository: ICollegeRepository,
    private emailService: IEmailService,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterDto) {
    const parsed = RegisterDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email, password, name, role, collegeId, phone } = parsed.data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    if (collegeId) {
      const college = await this.collegeRepository.findById(collegeId);
      if (!college) {
        throw new AppError('College not found', 404);
      }
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const emailVerificationToken = generateVerificationToken();

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      collegeId: collegeId || null,
      phone,
      isEmailVerified: false,
      emailVerificationToken,
      isActive: true,
    });

    try {
      await this.emailService.sendVerificationEmail(email, emailVerificationToken, name);
    } catch (error) {
      logger.warn('Failed to send verification email', { email, error });
    }

    return user;
  }
}
