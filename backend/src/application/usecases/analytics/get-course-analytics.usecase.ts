import { AppError } from '../../../shared/errors/AppError';

export interface IAnalyticsRepository {
  getCourseAnalytics(courseId: string): Promise<{
    courseId: string;
    courseTitle: string;
    totalEnrollments: number;
    activeEnrollments: number;
    completionRate: number;
    averageScore: number;
    averageAttendance: number;
    dropoutRate: number;
    monthlyEnrollments: Array<{ month: string; year: number; count: number }>;
    scoreDistribution: Array<{ range: string; count: number }>;
  }>;
}

export class GetCourseAnalyticsUseCase {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async execute(courseId: string) {
    if (!courseId) {
      throw new AppError('Course ID is required', 400);
    }

    return this.analyticsRepository.getCourseAnalytics(courseId);
  }
}
