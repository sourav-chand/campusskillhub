import { Course } from '../entities/Course';
import { CourseCategory } from '../value-objects/enums';

export interface ICourseRepository {
  findById(id: string): Promise<Course | null>;
  create(course: Course): Promise<Course>;
  update(id: string, data: Partial<Course>): Promise<Course | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Course[]>;
  findByCategory(category: CourseCategory): Promise<Course[]>;
  findByCollege(collegeId: string): Promise<Course[]>;
  findByTrainer(trainerId: string): Promise<Course[]>;
  search(query: string): Promise<Course[]>;
}
