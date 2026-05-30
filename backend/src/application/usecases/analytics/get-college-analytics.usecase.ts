import { CollegeAnalyticsDto } from '../../dto/analytics.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAnalyticsRepository {
  getCollegeAnalytics(collegeId: string): Promise<CollegeAnalyticsDto>;
}

export class GetCollegeAnalyticsUseCase {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async execute(collegeId: string): Promise<CollegeAnalyticsDto> {
    if (!collegeId) {
      throw new AppError('College ID is required', 400);
    }

    return this.analyticsRepository.getCollegeAnalytics(collegeId);
  }
}
