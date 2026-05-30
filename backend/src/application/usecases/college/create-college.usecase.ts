import { CreateCollegeDto, CreateCollegeDtoSchema } from '../../dto/college.dto';
import { AppError } from '../../../shared/errors/AppError';
import { generateSlug, generateRandomPassword } from '../../../shared/utils/helpers';

export interface ICollegeRepository {
  findByEmail(email: string): Promise<unknown>;
  findByCode(code: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}

export class CreateCollegeUseCase {
  constructor(
    private collegeRepository: ICollegeRepository,
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: CreateCollegeDto) {
    const parsed = CreateCollegeDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { adminEmail, adminName, adminPassword, ...collegeData } = parsed.data;

    const existingCollege = await this.collegeRepository.findByEmail(collegeData.email);
    if (existingCollege) {
      throw new AppError('College with this email already exists', 409);
    }

    if (collegeData.code) {
      const existingCode = await this.collegeRepository.findByCode(collegeData.code);
      if (existingCode) {
        throw new AppError('College with this code already exists', 409);
      }
    }

    const existingAdmin = await this.userRepository.findByEmail(adminEmail);
    if (existingAdmin) {
      throw new AppError('Admin email already registered', 409);
    }

    const slug = generateSlug(collegeData.name);
    const password = adminPassword || generateRandomPassword();
    const hashedPassword = await this.passwordHasher.hash(password);

    const college = await this.collegeRepository.create({
      ...collegeData,
      slug,
      isActive: true,
      isApproved: false,
    });

    const admin = await this.userRepository.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'college_admin',
      collegeId: college.id,
      isEmailVerified: false,
      isActive: true,
    });

    return { college, admin, temporaryPassword: password };
  }
}
