import { MCQOption } from './MCQOption';

export class MCQQuestion {
  constructor(
    public readonly id: string,
    public readonly testId: string,
    public readonly questionText: string,
    public readonly options: MCQOption[],
    public readonly correctOptionId: string,
    public readonly explanation: string | null,
    public readonly points: number,
    public readonly order: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    testId: string;
    questionText: string;
    options: MCQOption[];
    correctOptionId: string;
    explanation?: string;
    points: number;
    order: number;
  }): MCQQuestion {
    return new MCQQuestion(
      crypto.randomUUID(),
      props.testId,
      props.questionText,
      props.options,
      props.correctOptionId,
      props.explanation ?? null,
      props.points,
      props.order,
    );
  }
}
