import { Course } from '../entities/Course';
import { CourseCategory } from '../value-objects/enums';

export interface CourseFilter {
  search?: string;
  category?: string;
  collegeId?: string;
  trainerId?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ICourseRepository {
  findById(id: string): Promise<Course | null>;
  create(course: Course): Promise<Course>;
  update(id: string, data: Partial<Course>): Promise<Course | null>;
  delete(id: string): Promise<boolean>;
  findAll(filter?: CourseFilter): Promise<{ data: Course[]; total: number }>;
  findByCategory(category: CourseCategory): Promise<Course[]>;
  findByCollege(collegeId: string): Promise<Course[]>;
  findByTrainer(trainerId: string): Promise<Course[]>;
  search(query: string): Promise<Course[]>;
}
