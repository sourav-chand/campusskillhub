export class MentorFeedback {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly milestoneId: string | null,
    public readonly mentorId: string,
    public readonly feedback: string,
    public readonly rating: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    projectId: string;
    milestoneId?: string;
    mentorId: string;
    feedback: string;
    rating: number;
  }): MentorFeedback {
    return new MentorFeedback(
      crypto.randomUUID(),
      props.projectId,
      props.milestoneId ?? null,
      props.mentorId,
      props.feedback,
      props.rating,
    );
  }
}
