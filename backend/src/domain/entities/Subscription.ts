export class Subscription {
  constructor(
    public readonly id: string,
    public readonly collegeId: string,
    public readonly planType: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly amount: number,
    public status: string,
    public readonly paymentId: string | null,
    public readonly features: Record<string, unknown> | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    collegeId: string;
    planType: string;
    startDate: Date;
    endDate: Date;
    amount: number;
    paymentId?: string;
    features?: Record<string, unknown>;
  }): Subscription {
    return new Subscription(
      crypto.randomUUID(),
      props.collegeId,
      props.planType,
      props.startDate,
      props.endDate,
      props.amount,
      'ACTIVE',
      props.paymentId ?? null,
      props.features ?? null,
    );
  }

  get isExpired(): boolean {
    return new Date() > this.endDate;
  }
}
