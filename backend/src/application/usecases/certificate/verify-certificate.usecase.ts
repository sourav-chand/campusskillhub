import { CertificateVerificationDto } from '../../dto/certificate.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ICertificateRepository {
  findByCertificateNumber(certificateNumber: string): Promise<{
    id: string; certificateNumber: string; isValid: boolean;
    studentName?: string; courseTitle?: string; collegeName?: string;
    issueDate: Date; expiryDate?: Date;
  } | null>;
}

export class VerifyCertificateUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(certificateNumber: string): Promise<CertificateVerificationDto> {
    if (!certificateNumber) {
      throw new AppError('Certificate number is required', 400);
    }

    const certificate = await this.certificateRepository.findByCertificateNumber(certificateNumber);

    if (!certificate) {
      return {
        certificateNumber,
        isValid: false,
        message: 'Certificate not found',
      };
    }

    if (!certificate.isValid) {
      return {
        certificateNumber,
        isValid: false,
        message: 'Certificate has been revoked or is invalid',
      };
    }

    if (certificate.expiryDate && new Date() > certificate.expiryDate) {
      return {
        certificateNumber,
        isValid: false,
        message: 'Certificate has expired',
      };
    }

    return {
      certificateNumber: certificate.certificateNumber,
      isValid: true,
      studentName: certificate.studentName,
      courseTitle: certificate.courseTitle,
      collegeName: certificate.collegeName,
      issueDate: certificate.issueDate,
      expiryDate: certificate.expiryDate,
      message: 'Certificate is valid',
    };
  }
}
