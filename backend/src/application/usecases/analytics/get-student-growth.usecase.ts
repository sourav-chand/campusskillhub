import { StudentGrowthDto } from '../../dto/analytics.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAnalyticsRepository {
  getStudentGrowth(params: {
    collegeId?: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    fromDate: Date;
    toDate: Date;
  }): Promise<StudentGrowthDto>;
}

export class GetStudentGrowthUseCase {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async execute(params: {
    collegeId?: string;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    fromDate?: string;
    toDate?: string;
  }): Promise<StudentGrowthDto> {
    const period = params.period || 'monthly';
    const toDate = params.toDate ? new Date(params.toDate) : new Date();
    const fromDate = params.fromDate
      ? new Date(params.fromDate)
      : new Date(toDate.getFullYear() - 1, toDate.getMonth(), 1);

    if (fromDate >= toDate) {
      throw new AppError('From date must be before to date', 400);
    }

    return this.analyticsRepository.getStudentGrowth({
      collegeId: params.collegeId,
      period,
      fromDate,
      toDate,
    });
  }
}
