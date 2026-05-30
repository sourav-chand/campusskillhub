export class CollegeAdmin {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly collegeId: string,
    public readonly designation: string,
    public readonly phone: string | null,
    public isActive: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    userId: string;
    collegeId: string;
    designation: string;
    phone?: string;
  }): CollegeAdmin {
    return new CollegeAdmin(
      crypto.randomUUID(),
      props.userId,
      props.collegeId,
      props.designation,
      props.phone ?? null,
      true,
    );
  }
}
