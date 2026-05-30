export class LiveClass {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly moduleId: string | null,
    public readonly lessonId: string | null,
    public readonly trainerId: string,
    public readonly scheduledAt: Date,
    public readonly duration: number,
    public readonly meetLink: string,
    public readonly recordingUrl: string | null,
    public status: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  private static generateMeetLink(): string {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    return `https://meet.google.com/${id}`;
  }

  static create(props: {
    title: string;
    description: string;
    courseId: string;
    moduleId?: string;
    lessonId?: string;
    trainerId: string;
    scheduledAt: Date;
    duration: number;
    recordingUrl?: string;
  }): LiveClass {
    return new LiveClass(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.moduleId ?? null,
      props.lessonId ?? null,
      props.trainerId,
      props.scheduledAt,
      props.duration,
      LiveClass.generateMeetLink(),
      props.recordingUrl ?? null,
      'SCHEDULED',
    );
  }
}
