export class CodingSubmission {
  constructor(
    public readonly id: string,
    public readonly assessmentId: string,
    public readonly studentId: string,
    public readonly code: string,
    public readonly language: string,
    public status: string,
    public readonly testResults: string | null,
    public totalMarks: number | null,
    public obtainedMarks: number | null,
    public submittedAt: Date | null,
    public gradedAt: Date | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    assessmentId: string;
    studentId: string;
    code: string;
    language: string;
  }): CodingSubmission {
    return new CodingSubmission(
      crypto.randomUUID(),
      props.assessmentId,
      props.studentId,
      props.code,
      props.language,
      'SUBMITTED',
      null,
      null,
      null,
      new Date(),
      null,
    );
  }
}
