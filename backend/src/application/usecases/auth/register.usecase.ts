import { RegisterDto, RegisterDtoSchema } from '../../dto/auth.dto';
import { AppError } from '../../../shared/errors/AppError';
import { logger } from '../../../shared/utils/logger';
import { generateVerificationToken } from '../../../shared/utils/helpers';
import { User } from '../../../domain/entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<unknown>;
  create(user: User): Promise<unknown>;
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
    private emailService: IEmailService,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterDto) {
    const parsed = RegisterDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email, password, firstName, lastName, role, collegeCode, phone } = parsed.data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const emailVerificationToken = generateVerificationToken();

    const userEntity = User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phone,
    });
    userEntity.verificationToken = emailVerificationToken;

    const user = await this.userRepository.create(userEntity);

    try {
      await this.emailService.sendVerificationEmail(email, emailVerificationToken, `${firstName} ${lastName}`);
    } catch (error) {
      logger.warn('Failed to send verification email', { email, error });
    }

    return user;
  }
}
