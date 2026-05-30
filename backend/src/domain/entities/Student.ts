export class Student {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly collegeId: string,
    public readonly enrollmentNumber: string,
    public readonly courseId: string | null,
    public readonly batch: string | null,
    public readonly semester: number | null,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly dateOfBirth: Date | null,
    public readonly gender: string | null,
    public isActive: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    userId: string;
    collegeId: string;
    enrollmentNumber: string;
    courseId?: string;
    batch?: string;
    semester?: number;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    gender?: string;
  }): Student {
    return new Student(
      crypto.randomUUID(),
      props.userId,
      props.collegeId,
      props.enrollmentNumber,
      props.courseId ?? null,
      props.batch ?? null,
      props.semester ?? null,
      props.phone ?? null,
      props.address ?? null,
      props.dateOfBirth ?? null,
      props.gender ?? null,
      true,
    );
  }
}
