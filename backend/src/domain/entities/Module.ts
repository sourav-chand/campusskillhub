export class Module {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly order: number,
    public totalLessons: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    title: string;
    description: string;
    courseId: string;
    order: number;
  }): Module {
    return new Module(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.order,
      0,
    );
  }
}
