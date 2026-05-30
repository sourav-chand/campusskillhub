import { AssignmentSubmission } from '../entities/AssignmentSubmission';
import { SubmissionStatus } from '../value-objects/enums';

export interface IAssignmentSubmissionRepository {
  findById(id: string): Promise<AssignmentSubmission | null>;
  create(submission: AssignmentSubmission): Promise<AssignmentSubmission>;
  update(id: string, data: Partial<AssignmentSubmission>): Promise<AssignmentSubmission | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<AssignmentSubmission[]>;
  findByAssignment(assignmentId: string): Promise<AssignmentSubmission[]>;
  findByStudent(studentId: string): Promise<AssignmentSubmission[]>;
  findByStatus(status: SubmissionStatus): Promise<AssignmentSubmission[]>;
}
