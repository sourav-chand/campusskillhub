export class MCQAnswer {
  constructor(
    public readonly id: string,
    public readonly attemptId: string,
    public readonly questionId: string,
    public readonly selectedOptionId: string,
    public readonly isCorrect: boolean,
    public readonly pointsAwarded: number,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(props: {
    attemptId: string;
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    pointsAwarded: number;
  }): MCQAnswer {
    return new MCQAnswer(
      crypto.randomUUID(),
      props.attemptId,
      props.questionId,
      props.selectedOptionId,
      props.isCorrect,
      props.pointsAwarded,
    );
  }
}
