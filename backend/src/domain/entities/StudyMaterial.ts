export class StudyMaterial {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly moduleId: string | null,
    public readonly lessonId: string | null,
    public readonly fileUrl: string,
    public readonly fileType: string,
    public readonly fileSize: number,
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
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
  }): StudyMaterial {
    return new StudyMaterial(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.moduleId ?? null,
      props.lessonId ?? null,
      props.fileUrl,
      props.fileType,
      props.fileSize,
      props.uploadedBy,
    );
  }
}
