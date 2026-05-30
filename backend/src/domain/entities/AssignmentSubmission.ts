import { SubmissionStatus } from '../value-objects/enums';

export class AssignmentSubmission {
  constructor(
    public readonly id: string,
    public readonly assignmentId: string,
    public readonly studentId: string,
    public readonly content: string,
    public readonly attachments: string[],
    public marks: number | null,
    public feedback: string | null,
    public status: SubmissionStatus,
    public submittedAt: Date | null,
    public gradedAt: Date | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    assignmentId: string;
    studentId: string;
    content: string;
    attachments?: string[];
  }): AssignmentSubmission {
    return new AssignmentSubmission(
      crypto.randomUUID(),
      props.assignmentId,
      props.studentId,
      props.content,
      props.attachments ?? [],
      null,
      null,
      SubmissionStatus.SUBMITTED,
      new Date(),
      null,
    );
  }
}
