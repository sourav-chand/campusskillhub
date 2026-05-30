import { MCQTest } from '../entities/MCQTest';

export interface IMCQTestRepository {
  findById(id: string): Promise<MCQTest | null>;
  create(test: MCQTest): Promise<MCQTest>;
  update(id: string, data: Partial<MCQTest>): Promise<MCQTest | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<MCQTest[]>;
  findByCourse(courseId: string): Promise<MCQTest[]>;
  findByModule(moduleId: string): Promise<MCQTest[]>;
}
