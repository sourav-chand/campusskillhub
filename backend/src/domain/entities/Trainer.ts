export class Trainer {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly collegeId: string,
    public readonly specialization: string[],
    public readonly qualification: string,
    public readonly experienceYears: number,
    public readonly bio: string | null,
    public isActive: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    userId: string;
    collegeId: string;
    specialization: string[];
    qualification: string;
    experienceYears: number;
    bio?: string;
  }): Trainer {
    return new Trainer(
      crypto.randomUUID(),
      props.userId,
      props.collegeId,
      props.specialization,
      props.qualification,
      props.experienceYears,
      props.bio ?? null,
      true,
    );
  }
}
