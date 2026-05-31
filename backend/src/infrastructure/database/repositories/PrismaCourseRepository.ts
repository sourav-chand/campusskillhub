import { PrismaClient, CourseCategory } from '@prisma/client';
import { ICourseRepository, CourseFilter } from '@domain/repositories/ICourseRepository';
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

  async findAll(filter?: CourseFilter): Promise<{ data: Course[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter?.category) {
      where.category = filter.category as CourseCategory;
    }
    if (filter?.collegeId) {
      where.collegeId = filter.collegeId;
    }
    if (filter?.trainerId) {
      where.trainerId = filter.trainerId;
    }
    if (filter?.isPublished !== undefined) {
      where.isPublished = filter.isPublished;
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const skip = (page - 1) * limit;
    const orderField = filter?.sortBy || 'createdAt';
    const orderDir = filter?.sortOrder || 'desc';

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { [orderField]: orderDir },
      }),
      this.prisma.course.count({ where: where as any }),
    ]);

    return {
      data: courses.map((c) => this.mapToEntity(c)),
      total,
    };
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
        studyMaterials: { orderBy: { createdAt: 'desc' } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) return null;
    return {
      ...course,
      _id: course.id,
      modules: course.modules.map(mod => ({
        ...mod,
        _id: mod.id,
        lessons: mod.lessons.map(({ content, ...lesson }) => ({
          ...lesson,
          _id: lesson.id,
          description: content,
        })),
      })),
      studyMaterials: course.studyMaterials.map(m => ({ ...m, _id: m.id })),
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

  async getModules(courseId: string): Promise<any[]> {
    const modules = await this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    return modules.map(mod => ({
      ...mod,
      _id: mod.id,
      lessons: mod.lessons.map(({ content, ...lesson }) => ({
        ...lesson,
        _id: lesson.id,
        description: content,
      })),
    }));
  }

  async addModule(courseId: string, data: { title: string; description?: string; order?: number }): Promise<any> {
    const maxOrder = await this.prisma.module.aggregate({
      where: { courseId },
      _max: { order: true },
    });
    const module = await this.prisma.module.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order ?? (maxOrder._max.order ?? 0) + 1,
        courseId,
      },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalModules: { increment: 1 } },
    });
    return module;
  }

  async updateModule(courseId: string, moduleId: string, data: Partial<{ title: string; description: string; order: number }>): Promise<any> {
    const module = await this.prisma.module.update({
      where: { id: moduleId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.order !== undefined && { order: data.order }),
      },
      include: { lessons: { orderBy: { order: 'asc' } } },
    });
    return module;
  }

  async deleteModule(courseId: string, moduleId: string): Promise<boolean> {
    try {
      await this.prisma.module.delete({ where: { id: moduleId } });
      await this.prisma.course.update({
        where: { id: courseId },
        data: { totalModules: { decrement: 1 } },
      });
      return true;
    } catch {
      return false;
    }
  }

  async addLesson(courseId: string, moduleId: string, data: { title: string; description?: string; videoUrl?: string; duration?: number; isFree?: boolean; order?: number }): Promise<any> {
    const maxOrder = await this.prisma.lesson.aggregate({
      where: { moduleId },
      _max: { order: true },
    });
    const lesson = await this.prisma.lesson.create({
      data: {
        title: data.title,
        content: data.description,
        videoUrl: data.videoUrl,
        duration: data.duration,
        isFree: data.isFree ?? false,
        order: data.order ?? (maxOrder._max.order ?? 0) + 1,
        moduleId,
      },
    });
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalLessons: { increment: 1 } },
    });
    const { content, ...lessonRest } = lesson;
    return { ...lessonRest, _id: lesson.id, description: content };
  }

  async updateLesson(courseId: string, moduleId: string, lessonId: string, data: Partial<{ title: string; description: string; videoUrl: string; duration: number; isFree: boolean; order: number }>): Promise<any> {
    const lesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { content: data.description }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.isFree !== undefined && { isFree: data.isFree }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    const { content, ...lessonRest } = lesson;
    return { ...lessonRest, _id: lesson.id, description: content };
  }

  async deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<boolean> {
    try {
      await this.prisma.lesson.delete({ where: { id: lessonId } });
      await this.prisma.course.update({
        where: { id: courseId },
        data: { totalLessons: { decrement: 1 } },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getStudyMaterials(courseId: string): Promise<any[]> {
    const materials = await this.prisma.studyMaterial.findMany({
      where: { courseId },
      include: { module: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return materials.map(m => ({ ...m, _id: m.id }));
  }

  async addStudyMaterial(courseId: string, data: { title: string; description?: string; fileUrl: string; fileType: string; fileSize?: number; moduleId?: string; uploadedBy: string }): Promise<any> {
    const material = await this.prisma.studyMaterial.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
        moduleId: data.moduleId || null,
        courseId,
        uploadedBy: data.uploadedBy,
      },
    });
    return { ...material, _id: material.id };
  }

  async updateStudyMaterial(id: string, data: Partial<{ title: string; description: string; fileUrl: string; fileType: string; fileSize: number; moduleId: string }>): Promise<any> {
    const material = await this.prisma.studyMaterial.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
        ...(data.fileType !== undefined && { fileType: data.fileType }),
        ...(data.fileSize !== undefined && { fileSize: data.fileSize }),
        ...(data.moduleId !== undefined && { moduleId: data.moduleId || null }),
      },
    });
    return { ...material, _id: material.id };
  }

  async deleteStudyMaterial(id: string): Promise<boolean> {
    try {
      await this.prisma.studyMaterial.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
