export class MCQTest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly moduleId: string | null,
    public readonly lessonId: string | null,
    public readonly duration: number,
    public readonly totalMarks: number,
    public readonly passingMarks: number,
    public totalQuestions: number,
    public isPublished: boolean,
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
    duration: number;
    totalMarks: number;
    passingMarks: number;
    createdBy: string;
  }): MCQTest {
    return new MCQTest(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.moduleId ?? null,
      props.lessonId ?? null,
      props.duration,
      props.totalMarks,
      props.passingMarks,
      0,
      false,
      props.createdBy,
    );
  }
}
