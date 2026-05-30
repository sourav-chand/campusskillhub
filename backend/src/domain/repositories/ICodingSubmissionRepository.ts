import { CodingSubmission } from '../entities/CodingSubmission';

export interface ICodingSubmissionRepository {
  findById(id: string): Promise<CodingSubmission | null>;
  create(submission: CodingSubmission): Promise<CodingSubmission>;
  update(id: string, data: Partial<CodingSubmission>): Promise<CodingSubmission | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<CodingSubmission[]>;
  findByAssessment(assessmentId: string): Promise<CodingSubmission[]>;
  findByStudent(studentId: string): Promise<CodingSubmission[]>;
}
