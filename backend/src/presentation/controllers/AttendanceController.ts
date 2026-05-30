import { Request, Response, NextFunction } from 'express';
import { MarkAttendanceUseCase } from '@application/usecases/attendance/mark-attendance.usecase';
import { GetAttendanceUseCase } from '@application/usecases/attendance/get-attendance.usecase';
import { GetMonthlyReportUseCase } from '@application/usecases/attendance/get-monthly-report.usecase';

export class AttendanceController {
  constructor(
    private markAttendanceUseCase: MarkAttendanceUseCase,
    private getAttendanceUseCase: GetAttendanceUseCase,
    private getMonthlyReportUseCase: GetMonthlyReportUseCase,
  ) {}

  mark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.markAttendanceUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getAttendanceUseCase.execute({
        studentId: req.params.studentId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getByClass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getAttendanceUseCase.execute({
        courseId: req.params.courseId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getMonthlyReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { month, year, collegeId, courseId } = req.query;
      const result = await this.getMonthlyReportUseCase.execute({
        collegeId: collegeId as string | undefined,
        courseId: courseId as string | undefined,
        month: Number(month),
        year: Number(year),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getToday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const today = new Date();
      const result = await this.getMonthlyReportUseCase.execute({
        courseId: req.params.courseId as string | undefined,
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
