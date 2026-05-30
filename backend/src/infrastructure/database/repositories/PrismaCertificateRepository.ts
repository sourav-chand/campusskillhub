import { PrismaClient, CertificateStatus } from '@prisma/client';
import { ICertificateRepository } from '@domain/repositories/ICertificateRepository';
import { Certificate } from '@domain/entities/Certificate';

export class PrismaCertificateRepository implements ICertificateRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    certificateId: string;
    title: string;
    description: string | null;
    issueDate: Date;
    expiryDate: Date | null;
    status: CertificateStatus;
    studentId: string;
    courseId: string;
    verificationUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Certificate {
    return new Certificate(
      data.id,
      data.certificateId,
      data.studentId,
      data.courseId,
      data.issueDate,
      data.issueDate,
      data.status as import('@domain/value-objects/enums').CertificateStatus,
      null,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Certificate | null> {
    const certificate = await this.prisma.certificate.findUnique({ where: { id } });
    return certificate ? this.mapToEntity(certificate) : null;
  }

  async create(certificate: Certificate): Promise<Certificate> {
    const created = await this.prisma.certificate.create({
      data: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        title: 'Certificate of Completion',
        description: null,
        issueDate: certificate.issuedDate,
        expiryDate: null,
        status: certificate.status as CertificateStatus,
        studentId: certificate.studentId,
        courseId: certificate.courseId,
        verificationUrl: null,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Certificate>): Promise<Certificate | null> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status as CertificateStatus;

    const updated = await this.prisma.certificate.update({
      where: { id },
      data: updateData,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.certificate.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Certificate[]> {
    const certificates = await this.prisma.certificate.findMany();
    return certificates.map((c) => this.mapToEntity(c));
  }

  async findByStudent(studentId: string): Promise<Certificate[]> {
    const certificates = await this.prisma.certificate.findMany({ where: { studentId } });
    return certificates.map((c) => this.mapToEntity(c));
  }

  async findByCourse(courseId: string): Promise<Certificate[]> {
    const certificates = await this.prisma.certificate.findMany({ where: { courseId } });
    return certificates.map((c) => this.mapToEntity(c));
  }

  async findByCertificateId(certificateId: string): Promise<Certificate | null> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
    });
    return certificate ? this.mapToEntity(certificate) : null;
  }

  async verify(certificateId: string): Promise<Certificate | null> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateId },
    });
    if (!certificate || certificate.status !== ('GENERATED' as CertificateStatus)) {
      return null;
    }
    return this.mapToEntity(certificate);
  }
}
