import { CollegeStatus } from '../value-objects/enums';

export class College {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly pincode: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly website: string | null,
    public readonly logo: string | null,
    public status: CollegeStatus,
    public readonly maxStudents: number,
    public readonly subscriptionEnd: Date | null,
    public readonly adminId: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    maxStudents: number;
    subscriptionEnd?: Date;
    adminId: string;
  }): College {
    return new College(
      crypto.randomUUID(),
      props.name,
      props.code,
      props.address,
      props.city,
      props.state,
      props.pincode,
      props.phone,
      props.email,
      props.website ?? null,
      props.logo ?? null,
      CollegeStatus.PENDING,
      props.maxStudents,
      props.subscriptionEnd ?? null,
      props.adminId,
    );
  }
}
