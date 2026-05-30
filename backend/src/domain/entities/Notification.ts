export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: string,
    public readonly title: string,
    public readonly message: string,
    public isRead: boolean,
    public readAt: Date | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(props: {
    userId: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }): Notification {
    return new Notification(
      crypto.randomUUID(),
      props.userId,
      props.type,
      props.title,
      props.message,
      false,
      null,
      props.metadata ?? null,
    );
  }
}
