export class CodingAssessment {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly courseId: string,
    public readonly moduleId: string | null,
    public readonly lessonId: string | null,
    public readonly language: string,
    public readonly problemStatement: string,
    public readonly inputFormat: string | null,
    public readonly outputFormat: string | null,
    public readonly sampleInput: string | null,
    public readonly sampleOutput: string | null,
    public readonly testCases: string,
    public readonly difficulty: string,
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
    language: string;
    problemStatement: string;
    inputFormat?: string;
    outputFormat?: string;
    sampleInput?: string;
    sampleOutput?: string;
    testCases: string;
    difficulty: string;
    createdBy: string;
  }): CodingAssessment {
    return new CodingAssessment(
      crypto.randomUUID(),
      props.title,
      props.description,
      props.courseId,
      props.moduleId ?? null,
      props.lessonId ?? null,
      props.language,
      props.problemStatement,
      props.inputFormat ?? null,
      props.outputFormat ?? null,
      props.sampleInput ?? null,
      props.sampleOutput ?? null,
      props.testCases,
      props.difficulty,
      false,
      props.createdBy,
    );
  }
}
