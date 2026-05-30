import { MCQAnswer } from './MCQAnswer';

export class MCQAttempt {
  constructor(
    public readonly id: string,
    public readonly testId: string,
    public readonly studentId: string,
    public readonly startedAt: Date,
    public submittedAt: Date | null,
    public totalMarks: number,
    public obtainedMarks: number,
    public percentage: number,
    public isPassed: boolean,
    public readonly answers: MCQAnswer[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    testId: string;
    studentId: string;
    answers: MCQAnswer[];
    totalMarks: number;
  }): MCQAttempt {
    return new MCQAttempt(
      crypto.randomUUID(),
      props.testId,
      props.studentId,
      new Date(),
      null,
      props.totalMarks,
      0,
      0,
      false,
      props.answers,
    );
  }
}
