export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly courseId: string,
    public progress: number,
    public completedModules: number,
    public completedLessons: number,
    public readonly startedAt: Date = new Date(),
    public completedAt: Date | null,
    public isCompleted: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    studentId: string;
    courseId: string;
  }): Enrollment {
    return new Enrollment(
      crypto.randomUUID(),
      props.studentId,
      props.courseId,
      0,
      0,
      0,
      new Date(),
      null,
      false,
    );
  }
}
