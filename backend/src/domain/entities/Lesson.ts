export class Lesson {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly moduleId: string,
    public readonly courseId: string,
    public readonly content: string | null,
    public readonly videoUrl: string | null,
    public readonly duration: number,
    public readonly order: number,
    public isPublished: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    title: string;
    description: string;
    moduleId: string;
    courseId: string;
    content?: string;
    videoUrl?: string;
    duration: number;
    order: number;
  }): Lesson {
    return new Lesson(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.moduleId,
      props.courseId,
      props.content ?? null,
      props.videoUrl ?? null,
      props.duration,
      props.order,
      false,
    );
  }
}
