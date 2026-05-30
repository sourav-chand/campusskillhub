import { Request, Response, NextFunction } from 'express';
import { CreateCourseUseCase } from '@application/usecases/course/create-course.usecase';
import { UpdateCourseUseCase } from '@application/usecases/course/update-course.usecase';
import { GetCourseUseCase } from '@application/usecases/course/get-course.usecase';
import { ListCoursesUseCase } from '@application/usecases/course/list-courses.usecase';
import { PublishCourseUseCase } from '@application/usecases/course/publish-course.usecase';

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
      const result = await this.createCourseUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateCourseUseCase.execute(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCourseUseCase.execute(req.params.id);
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
      const result = await this.publishCourseUseCase.execute(req.params.id, publish);
      res.status(200).json({ success: true, data: result });
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
