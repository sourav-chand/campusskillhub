export class MCQOption {
  constructor(
    public readonly id: string,
    public readonly questionId: string,
    public readonly text: string,
    public readonly isCorrect: boolean,
    public readonly order: number,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(props: {
    questionId: string;
    text: string;
    isCorrect: boolean;
    order: number;
  }): MCQOption {
    return new MCQOption(
      crypto.randomUUID(),
      props.questionId,
      props.text,
      props.isCorrect,
      props.order,
    );
  }
}
