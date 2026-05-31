import { CourseCategory } from '../value-objects/enums';

export class Course {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly description: string,
    public readonly category: CourseCategory,
    public readonly thumbnail: string | null,
    public readonly duration: number,
    public totalModules: number,
    public totalLessons: number,
    public readonly price: number,
    public isPublished: boolean,
    public readonly collegeId: string,
    public readonly trainerId: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(props: {
    title: string;
    slug: string;
    description: string;
    category: CourseCategory;
    thumbnail?: string;
    duration: number;
    price: number;
    collegeId: string;
    trainerId: string;
  }): Course {
    return new Course(
      crypto.randomUUID(),
      props.title,
      props.slug,
      props.description,
      props.category,
      props.thumbnail ?? null,
      props.duration,
      0,
      0,
      props.price,
      false,
      props.collegeId,
      props.trainerId,
    );
  }
}
