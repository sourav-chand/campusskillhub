import { PrismaClient, CourseCategory } from '@prisma/client';
import { ICourseRepository } from '@domain/repositories/ICourseRepository';
import { Course } from '@domain/entities/Course';

export class PrismaCourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    description: string;
    category: CourseCategory;
    thumbnail: string | null;
    duration: number;
    totalModules: number;
    totalLessons: number;
    price: number | null;
    isPublished: boolean;
    collegeId: string;
    trainerId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Course {
    return new Course(
      data.id,
      data.title,
      data.description,
      data.category as import('@domain/value-objects/enums').CourseCategory,
      data.thumbnail,
      data.duration,
      data.totalModules,
      data.totalLessons,
      data.price ?? 0,
      data.isPublished,
      data.collegeId,
      data.trainerId ?? '',
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    return course ? this.mapToEntity(course) : null;
  }

  async create(course: Course): Promise<Course> {
    const created = await this.prisma.course.create({
      data: {
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category as CourseCategory,
        thumbnail: course.thumbnail,
        duration: course.duration,
        totalModules: course.totalModules,
        totalLessons: course.totalLessons,
        price: course.price,
        isPublished: course.isPublished,
        collegeId: course.collegeId,
        trainerId: course.trainerId,
      },
    });
    return this.mapToEntity(created);
  }

  async update(id: string, data: Partial<Course>): Promise<Course | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category as CourseCategory;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.totalModules !== undefined) updateData.totalModules = data.totalModules;
    if (data.totalLessons !== undefined) updateData.totalLessons = data.totalLessons;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.trainerId !== undefined) updateData.trainerId = data.trainerId;

    const updated = await this.prisma.course.update({ where: { id }, data: updateData });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.course.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany();
    return courses.map((c) => this.mapToEntity(c));
  }

  async findByCategory(category: import('@domain/value-objects/enums').CourseCategory): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { category: category as unknown as CourseCategory },
    });
    return courses.map((c) => this.mapToEntity(c));
  }

  async findByCollege(collegeId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({ where: { collegeId } });
    return courses.map((c) => this.mapToEntity(c));
  }

  async findByTrainer(trainerId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({ where: { trainerId } });
    return courses.map((c) => this.mapToEntity(c));
  }

  async search(query: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return courses.map((c) => this.mapToEntity(c));
  }
}
