import { PrismaClient, CourseCategory } from '@prisma/client';
import { ICourseRepository } from '@domain/repositories/ICourseRepository';
import { Course } from '@domain/entities/Course';

export class PrismaCourseRepository implements ICourseRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(data: {
    id: string;
    title: string;
    slug: string | null;
    description: string;
    category: CourseCategory;
    thumbnail: string | null;
    duration: number;
    totalModules: number;
    totalLessons: number;
    price: number | null;
    isPublished: boolean;
    collegeId: string | null;
    trainerId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Course {
    return new Course(
      data.id,
      data.title,
      data.slug ?? '',
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
    const data: Record<string, unknown> = {
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category as CourseCategory,
      thumbnail: course.thumbnail,
      duration: course.duration,
      totalModules: course.totalModules,
      totalLessons: course.totalLessons,
      price: course.price,
      isPublished: course.isPublished,
      trainerId: course.trainerId || null,
    };
    if (course.id) data.id = course.id;
    if (course.collegeId) data.collegeId = course.collegeId;
    const created = await this.prisma.course.create({ data: data as any });
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
    if (data.slug !== undefined) updateData.slug = data.slug;
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

  async findBySlug(slug: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({ where: { slug } });
    return course ? this.mapToEntity(course) : null;
  }

  async findByIdWithDetails(id: string): Promise<Record<string, unknown> | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        college: { select: { id: true, name: true } },
        trainer: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        modules: {
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) return null;
    return {
      ...course,
      collegeName: course.college?.name ?? null,
      trainerName: course.trainer ? `${course.trainer.user.firstName} ${course.trainer.user.lastName}` : null,
      enrollmentCount: course._count.enrollments,
      trainer: undefined,
      college: undefined,
      _count: undefined,
    };
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
