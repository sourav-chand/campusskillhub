import { CodingAssessment } from '../entities/CodingAssessment';

export interface ICodingAssessmentRepository {
  findById(id: string): Promise<CodingAssessment | null>;
  create(assessment: CodingAssessment): Promise<CodingAssessment>;
  update(id: string, data: Partial<CodingAssessment>): Promise<CodingAssessment | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<CodingAssessment[]>;
  findByCourse(courseId: string): Promise<CodingAssessment[]>;
  findByModule(moduleId: string): Promise<CodingAssessment[]>;
}
