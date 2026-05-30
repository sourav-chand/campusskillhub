import { MCQAttempt } from '../entities/MCQAttempt';

export interface IMCQAttemptRepository {
  findById(id: string): Promise<MCQAttempt | null>;
  create(attempt: MCQAttempt): Promise<MCQAttempt>;
  update(id: string, data: Partial<MCQAttempt>): Promise<MCQAttempt | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<MCQAttempt[]>;
  findByTest(testId: string): Promise<MCQAttempt[]>;
  findByStudent(studentId: string): Promise<MCQAttempt[]>;
  findByStudentAndTest(studentId: string, testId: string): Promise<MCQAttempt[]>;
}
