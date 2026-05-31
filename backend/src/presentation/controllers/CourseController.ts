import { Request, Response, NextFunction } from 'express';
import { container } from '@config/container';
import { CreateCourseUseCase } from '@application/usecases/course/create-course.usecase';
import { UpdateCourseUseCase } from '@application/usecases/course/update-course.usecase';
import { GetCourseUseCase } from '@application/usecases/course/get-course.usecase';
import { ListCoursesUseCase } from '@application/usecases/course/list-courses.usecase';
import { PublishCourseUseCase } from '@application/usecases/course/publish-course.usecase';
import { AppError } from '@shared/errors/AppError';

export class CourseController {
  constructor(
    private createCourseUseCase: CreateCourseUseCase,
    private updateCourseUseCase: UpdateCourseUseCase,
    private getCourseUseCase: GetCourseUseCase,
    private listCoursesUseCase: ListCoursesUseCase,
    private publishCourseUseCase: PublishCourseUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.body.trainerId || (req.user as any).userId;
      const trainer = await container.prisma.trainer.findUnique({ where: { userId } });
      if (!trainer) {
        throw new AppError('Trainer profile not found for this user', 400);
      }
      const body = {
        ...req.body,
        trainerId: trainer.id,
      };
      const result = await this.createCourseUseCase.execute(body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateCourseUseCase.execute(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCourseUseCase.execute(req.params.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listCoursesUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publish = req.body.publish !== false;
      const result = await this.publishCourseUseCase.execute(req.params.id as string, publish);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getModules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const modules = await container.repositories.courseRepository.getModules(req.params.id as string);
      res.status(200).json({ success: true, data: modules });
    } catch (error) {
      next(error);
    }
  };

  addModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await container.repositories.courseRepository.addModule(req.params.id as string, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  updateModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await container.repositories.courseRepository.updateModule(req.params.id as string, req.params.moduleId as string, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await container.repositories.courseRepository.deleteModule(req.params.id as string, req.params.moduleId as string);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  };

  addLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await container.repositories.courseRepository.addLesson(req.params.id as string, req.params.moduleId as string, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  updateLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await container.repositories.courseRepository.updateLesson(req.params.id as string, req.params.moduleId as string, req.params.lessonId as string, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  deleteLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await container.repositories.courseRepository.deleteLesson(req.params.id as string, req.params.moduleId as string, req.params.lessonId as string);
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = [
        'full_stack_development',
        'devops',
        'cloud_computing',
        'java',
        'dotnet',
        'python',
        'data_science',
        'artificial_intelligence',
        'mobile_development',
        'cybersecurity',
      ];
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };
}
