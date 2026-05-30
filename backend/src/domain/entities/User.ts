export class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public role: string,
    public phone?: string | null,
    public avatar?: string | null,
    public isVerified: boolean = false,
    public isActive: boolean = true,
    public verificationToken?: string | null,
    public resetToken?: string | null,
    public resetTokenExp?: Date | null,
    public lastLogin?: Date | null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static create(props: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
  }): User {
    return new User(
      crypto.randomUUID(),
      props.email,
      props.password,
      props.firstName,
      props.lastName,
      props.role,
      props.phone,
    );
  }
}
