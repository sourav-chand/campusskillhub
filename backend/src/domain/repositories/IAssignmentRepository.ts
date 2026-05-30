import { Assignment } from '../entities/Assignment';

export interface IAssignmentRepository {
  findById(id: string): Promise<Assignment | null>;
  create(assignment: Assignment): Promise<Assignment>;
  update(id: string, data: Partial<Assignment>): Promise<Assignment | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Assignment[]>;
  findByCourse(courseId: string): Promise<Assignment[]>;
  findByModule(moduleId: string): Promise<Assignment[]>;
  findByTrainer(trainerId: string): Promise<Assignment[]>;
}
