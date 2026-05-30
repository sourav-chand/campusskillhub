export class Assignment {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly moduleId: string | null,
    public readonly lessonId: string | null,
    public readonly dueDate: Date,
    public readonly totalMarks: number,
    public readonly passingMarks: number,
    public readonly attachments: string[],
    public readonly createdBy: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    title: string;
    description: string;
    courseId: string;
    moduleId?: string;
    lessonId?: string;
    dueDate: Date;
    totalMarks: number;
    passingMarks: number;
    attachments?: string[];
    createdBy: string;
  }): Assignment {
    return new Assignment(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.moduleId ?? null,
      props.lessonId ?? null,
      props.dueDate,
      props.totalMarks,
      props.passingMarks,
      props.attachments ?? [],
      props.createdBy,
    );
  }
}
