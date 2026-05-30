import { Certificate } from '../entities/Certificate';

export interface ICertificateRepository {
  findById(id: string): Promise<Certificate | null>;
  create(certificate: Certificate): Promise<Certificate>;
  update(id: string, data: Partial<Certificate>): Promise<Certificate | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Certificate[]>;
  findByStudent(studentId: string): Promise<Certificate[]>;
  findByCourse(courseId: string): Promise<Certificate[]>;
  findByCertificateId(certificateId: string): Promise<Certificate | null>;
  verify(certificateId: string): Promise<Certificate | null>;
}
