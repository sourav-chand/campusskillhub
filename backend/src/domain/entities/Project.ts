import { ProjectType, ProjectStatus } from '../value-objects/enums';

export class Project {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly type: ProjectType,
    public status: ProjectStatus,
    public readonly courseId: string,
    public readonly studentId: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly githubRepo: string | null,
    public readonly demoLink: string | null,
    public totalMarks: number | null,
    public obtainedMarks: number | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    title: string;
    description: string;
    type: ProjectType;
    courseId: string;
    studentId: string;
    startDate: Date;
    endDate?: Date;
    githubRepo?: string;
    demoLink?: string;
  }): Project {
    return new Project(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.type,
      ProjectStatus.NOT_STARTED,
      props.courseId,
      props.studentId,
      props.startDate,
      props.endDate ?? null,
      props.githubRepo ?? null,
      props.demoLink ?? null,
      null,
      null,
    );
  }
}
