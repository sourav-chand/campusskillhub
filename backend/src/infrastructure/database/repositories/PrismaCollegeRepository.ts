import { PrismaClient, CollegeStatus } from '@prisma/client';
import { ICollegeRepository } from '@domain/repositories/ICollegeRepository';
import { College } from '@domain/entities/College';

export class PrismaCollegeRepository implements ICollegeRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    website: string | null;
    logo: string | null;
    status: CollegeStatus;
    maxStudents: number;
    subscriptionEnd: Date | null;
    adminId: string;
    createdAt: Date;
    updatedAt: Date;
  }): College {
    return new College(
      data.id,
      data.name,
      data.code,
      data.address,
      data.city,
      data.state,
      data.pincode,
      data.phone,
      data.email,
      data.website,
      data.logo,
      data.status as import('@domain/value-objects/enums').CollegeStatus,
      data.maxStudents,
      data.subscriptionEnd,
      data.adminId,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<College | null> {
    const college = await this.prisma.college.findUnique({ where: { id } });
    return college ? this.mapToEntity(college) : null;
  }

  async create(college: College): Promise<College> {
    const created = await this.prisma.college.create({
      data: {
        id: college.id,
        name: college.name,
        code: college.code,
        address: college.address,
        city: college.city,
        state: college.state,
        pincode: college.pincode,
        phone: college.phone,
        email: college.email,
        website: college.website,
        logo: college.logo,
        status: college.status as CollegeStatus,
        maxStudents: college.maxStudents,
        subscriptionEnd: college.subscriptionEnd,
        adminId: college.adminId,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<College>): Promise<College | null> {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.logo !== undefined) updateData.logo = data.logo;
    if (data.status !== undefined) updateData.status = data.status as CollegeStatus;
    if (data.maxStudents !== undefined) updateData.maxStudents = data.maxStudents;
    if (data.subscriptionEnd !== undefined) updateData.subscriptionEnd = data.subscriptionEnd;

    const updated = await this.prisma.college.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.college.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<College[]> {
    const colleges = await this.prisma.college.findMany();
    return colleges.map((c) => this.mapToEntity(c));
  }

  async findByStatus(status: import('@domain/value-objects/enums').CollegeStatus): Promise<College[]> {
    const colleges = await this.prisma.college.findMany({
      where: { status: status as unknown as CollegeStatus },
    });
    return colleges.map((c) => this.mapToEntity(c));
  }

  async findByCode(code: string): Promise<College | null> {
    const college = await this.prisma.college.findUnique({ where: { code } });
    return college ? this.mapToEntity(college) : null;
  }

  async countByStatus(status: import('@domain/value-objects/enums').CollegeStatus): Promise<number> {
    return this.prisma.college.count({
      where: { status: status as unknown as CollegeStatus },
    });
  }
}
