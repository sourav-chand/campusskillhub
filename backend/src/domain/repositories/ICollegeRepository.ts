import { College } from '../entities/College';
import { CollegeStatus } from '../value-objects/enums';

export interface ICollegeRepository {
  findById(id: string): Promise<College | null>;
  create(college: College): Promise<College>;
  update(id: string, data: Partial<College>): Promise<College | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<College[]>;
  findByStatus(status: CollegeStatus): Promise<College[]>;
  findByCode(code: string): Promise<College | null>;
  countByStatus(status: CollegeStatus): Promise<number>;
}
