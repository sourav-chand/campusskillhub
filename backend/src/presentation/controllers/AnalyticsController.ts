import { Request, Response, NextFunction } from 'express';
import { GetDashboardStatsUseCase } from '@application/usecases/analytics/get-dashboard-stats.usecase';
import { GetStudentGrowthUseCase } from '@application/usecases/analytics/get-student-growth.usecase';
import { GetCourseAnalyticsUseCase } from '@application/usecases/analytics/get-course-analytics.usecase';
import { GetCollegeAnalyticsUseCase } from '@application/usecases/analytics/get-college-analytics.usecase';

export class AnalyticsController {
  constructor(
    private getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private getStudentGrowthUseCase: GetStudentGrowthUseCase,
    private getCourseAnalyticsUseCase: GetCourseAnalyticsUseCase,
    private getCollegeAnalyticsUseCase: GetCollegeAnalyticsUseCase,
  ) {}

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getDashboardStatsUseCase.execute({
        role: req.user!.role,
        userId: req.user!.userId,
        collegeId: (req.user as { collegeId?: string }).collegeId,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getStudentGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getStudentGrowthUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getCourseAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCourseAnalyticsUseCase.execute(req.params.courseId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getCollegeAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCollegeAnalyticsUseCase.execute(req.params.collegeId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getEnrollmentTrend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getStudentGrowthUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getStudentDistribution = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: [] });
    } catch (error) {
      next(error);
    }
  };

  getCourseCompletion = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: [] });
    } catch (error) {
      next(error);
    }
  };

  getTopCourses = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: [] });
    } catch (error) {
      next(error);
    }
  };

  getAttendanceAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: [] });
    } catch (error) {
      next(error);
    }
  };

  getPerformanceMetrics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  };

  getRevenueAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true, data: { message: 'Revenue analytics endpoint' } });
    } catch (error) {
      next(error);
    }
  };
}
