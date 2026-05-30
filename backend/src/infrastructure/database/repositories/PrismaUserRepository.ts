import { PrismaClient, UserRole } from '@prisma/client';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';

function toPrismaRole(role: string): UserRole {
  const map: Record<string, UserRole> = {
    student: UserRole.STUDENT,
    trainer: UserRole.TRAINER,
    admin: UserRole.COLLEGE_ADMIN,
    college_admin: UserRole.COLLEGE_ADMIN,
    super_admin: UserRole.SUPER_ADMIN,
  };
  return map[role] ?? (role as UserRole);
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone: string | null;
    avatar: string | null;
    isVerified: boolean;
    isActive: boolean;
    verificationToken: string | null;
    resetToken: string | null;
    resetTokenExp: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role,
      data.phone,
      data.avatar,
      data.isVerified,
      data.isActive,
      data.verificationToken,
      data.resetToken,
      data.resetTokenExp,
      data.lastLogin,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.mapToEntity(user) : null;
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: toPrismaRole(user.role),
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isActive: user.isActive,
        verificationToken: user.verificationToken,
        resetToken: user.resetToken,
        resetTokenExp: user.resetTokenExp,
        lastLogin: user.lastLogin,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updateData: Record<string, unknown> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.role !== undefined) updateData.role = toPrismaRole(data.role);
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.verificationToken !== undefined) updateData.verificationToken = data.verificationToken;
    if (data.resetToken !== undefined) updateData.resetToken = data.resetToken;
    if (data.resetTokenExp !== undefined) updateData.resetTokenExp = data.resetTokenExp;
    if (data.lastLogin !== undefined) updateData.lastLogin = data.lastLogin;

    const updated = await this.prisma.user.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.mapToEntity(u));
  }

  async findByRole(role: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({ where: { role: toPrismaRole(role) } });
    return users.map((u) => this.mapToEntity(u));
  }

  async findByCollege(collegeId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { collegeAdmin: { collegeId } },
          { trainer: { collegeId } },
          { student: { collegeId } },
        ],
      },
    });
    return users.map((u) => this.mapToEntity(u));
  }
}
