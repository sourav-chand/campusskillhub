import { Request, Response, NextFunction } from 'express';
import { CreateEnrollmentUseCase } from '@application/usecases/enrollment/create-enrollment.usecase';
import { GetEnrollmentsUseCase } from '@application/usecases/enrollment/get-enrollments.usecase';
import { UpdateProgressUseCase } from '@application/usecases/enrollment/update-progress.usecase';

export class EnrollmentController {
  constructor(
    private createEnrollmentUseCase: CreateEnrollmentUseCase,
    private getEnrollmentsUseCase: GetEnrollmentsUseCase,
    private updateProgressUseCase: UpdateProgressUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createEnrollmentUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  listByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getEnrollmentsUseCase.execute({
        studentId: req.params.studentId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  listByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getEnrollmentsUseCase.execute({
        courseId: req.params.courseId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateProgressUseCase.execute({
        enrollmentId: req.params.id,
        ...req.body,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
