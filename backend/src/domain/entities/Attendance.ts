import { AttendanceStatus } from '../value-objects/enums';

export class Attendance {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly liveClassId: string,
    public readonly date: Date,
    public status: AttendanceStatus,
    public readonly markedBy: string,
    public readonly remarks: string | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    studentId: string;
    liveClassId: string;
    date: Date;
    status: AttendanceStatus;
    markedBy: string;
    remarks?: string;
  }): Attendance {
    return new Attendance(
      crypto.randomUUID(),
      props.studentId,
      props.liveClassId,
      props.date,
      props.status,
      props.markedBy,
      props.remarks ?? null,
    );
  }
}
