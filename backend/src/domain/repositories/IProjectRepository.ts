import { Project } from '../entities/Project';
import { ProjectType } from '../value-objects/enums';

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Project[]>;
  findByStudent(studentId: string): Promise<Project[]>;
  findByCourse(courseId: string): Promise<Project[]>;
  findByType(type: ProjectType): Promise<Project[]>;
  getProgress(projectId: string): Promise<number>;
}
