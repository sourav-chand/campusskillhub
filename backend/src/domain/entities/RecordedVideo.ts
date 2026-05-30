export class RecordedVideo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly moduleId: string | null,
    public readonly lessonId: string | null,
    public readonly videoUrl: string,
    public readonly duration: number,
    public readonly thumbnail: string | null,
    public readonly uploadedBy: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    title: string;
    description: string;
    courseId: string;
    moduleId?: string;
    lessonId?: string;
    videoUrl: string;
    duration: number;
    thumbnail?: string;
    uploadedBy: string;
  }): RecordedVideo {
    return new RecordedVideo(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.moduleId ?? null,
      props.lessonId ?? null,
      props.videoUrl,
      props.duration,
      props.thumbnail ?? null,
      props.uploadedBy,
    );
  }
}
