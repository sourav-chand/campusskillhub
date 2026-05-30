import { Enrollment } from '../entities/Enrollment';

export interface IEnrollmentRepository {
  findById(id: string): Promise<Enrollment | null>;
  create(enrollment: Enrollment): Promise<Enrollment>;
  update(id: string, data: Partial<Enrollment>): Promise<Enrollment | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Enrollment[]>;
  findByStudent(studentId: string): Promise<Enrollment[]>;
  findByCourse(courseId: string): Promise<Enrollment[]>;
  countByCourse(courseId: string): Promise<number>;
  getProgress(studentId: string, courseId: string): Promise<number>;
}
