import { PrismaClient, ProjectType, ProjectStatus } from '@prisma/client';
import { IProjectRepository } from '@domain/repositories/IProjectRepository';
import { Project } from '@domain/entities/Project';

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    description: string;
    type: ProjectType;
    status: ProjectStatus;
    progress: number;
    startDate: Date | null;
    endDate: Date | null;
    githubUrl: string | null;
    demoUrl: string | null;
    studentId: string;
    courseId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Project {
    return new Project(
      data.id,
      data.title,
      data.description,
      data.type as import('@domain/value-objects/enums').ProjectType,
      data.status as import('@domain/value-objects/enums').ProjectStatus,
      data.courseId ?? '',
      data.studentId,
      data.startDate ?? new Date(),
      data.endDate,
      data.githubUrl,
      data.demoUrl,
      null,
      null,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    return project ? this.mapToEntity(project) : null;
  }

  async create(project: Project): Promise<Project> {
    const created = await this.prisma.project.create({
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        type: project.type as ProjectType,
        status: project.status as ProjectStatus,
        startDate: project.startDate,
        endDate: project.endDate,
        githubUrl: project.githubRepo,
        demoUrl: project.demoLink,
        studentId: project.studentId,
        courseId: project.courseId,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type as ProjectType;
    if (data.status !== undefined) updateData.status = data.status as ProjectStatus;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.githubRepo !== undefined) updateData.githubUrl = data.githubRepo;
    if (data.demoLink !== undefined) updateData.demoUrl = data.demoLink;

    const updated = await this.prisma.project.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.project.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany();
    return projects.map((p) => this.mapToEntity(p));
  }

  async findByStudent(studentId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({ where: { studentId } });
    return projects.map((p) => this.mapToEntity(p));
  }

  async findByCourse(courseId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({ where: { courseId } });
    return projects.map((p) => this.mapToEntity(p));
  }

  async findByType(type: import('@domain/value-objects/enums').ProjectType): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { type: type as unknown as ProjectType },
    });
    return projects.map((p) => this.mapToEntity(p));
  }

  async getProgress(projectId: string): Promise<number> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { progress: true },
    });
    return project?.progress ?? 0;
  }
}
