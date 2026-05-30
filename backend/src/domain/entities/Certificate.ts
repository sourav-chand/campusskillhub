import { CertificateStatus } from '../value-objects/enums';

export class Certificate {
  constructor(
    public readonly id: string,
    public readonly certificateId: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public readonly completionDate: Date,
    public readonly issuedDate: Date,
    public status: CertificateStatus,
    public readonly metadata: Record<string, unknown> | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  private static generateCertificateId(): string {
    const prefix = 'CERT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomUUID().slice(0, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  static create(props: {
    studentId: string;
    courseId: string;
    completionDate: Date;
    metadata?: Record<string, unknown>;
  }): Certificate {
    return new Certificate(
      crypto.randomUUID(),
      Certificate.generateCertificateId(),
      props.studentId,
      props.courseId,
      props.completionDate,
      new Date(),
      CertificateStatus.PENDING,
      props.metadata ?? null,
    );
  }
}
