export class ProjectMilestone {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly dueDate: Date,
    public completedDate: Date | null,
    public status: string,
    public readonly order: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    projectId: string;
    title: string;
    description: string;
    dueDate: Date;
    order: number;
  }): ProjectMilestone {
    return new ProjectMilestone(
      crypto.randomUUID(),
      props.projectId,
      props.title,
      props.description,
      props.dueDate,
      null,
      'PENDING',
      props.order,
    );
  }
}
