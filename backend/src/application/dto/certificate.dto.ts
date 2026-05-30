export interface CertificateResponseDto {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  courseId: string;
  courseTitle: string;
  collegeId: string;
  collegeName?: string;
  issueDate: Date;
  expiryDate?: Date;
  grade?: string;
  score?: number;
  totalHours?: number;
  credentialUrl?: string;
  metadata?: Record<string, unknown>;
  isValid: boolean;
  generatedAt: Date;
}

export interface CertificateVerificationDto {
  certificateNumber: string;
  isValid: boolean;
  studentName?: string;
  courseTitle?: string;
  collegeName?: string;
  issueDate?: Date;
  expiryDate?: Date;
  message: string;
}
