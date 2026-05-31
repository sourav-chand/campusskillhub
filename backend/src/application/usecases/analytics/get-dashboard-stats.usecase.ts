import { DashboardStatsDto } from '../../dto/analytics.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IDashboardRepository {
  getAdminStats(): Promise<DashboardStatsDto>;
  getCollegeStats(collegeId: string): Promise<DashboardStatsDto>;
  getTrainerStats(trainerId: string): Promise<DashboardStatsDto>;
  getStudentStats(studentId: string): Promise<DashboardStatsDto>;
}

export class GetDashboardStatsUseCase {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(params: {
    role: string;
    userId: string;
    collegeId?: string;
  }): Promise<DashboardStatsDto> {
    const { role, userId, collegeId } = params;

    switch (role) {
      case 'SUPER_ADMIN':
      case 'super_admin':
        return this.dashboardRepository.getAdminStats();
      case 'COLLEGE_ADMIN':
      case 'college_admin':
        if (!collegeId) throw new AppError('College ID is required for college admin', 400);
        return this.dashboardRepository.getCollegeStats(collegeId);
      case 'TRAINER':
      case 'trainer':
        return this.dashboardRepository.getTrainerStats(userId);
      case 'STUDENT':
      case 'student':
        return this.dashboardRepository.getStudentStats(userId);
      default:
        throw new AppError('Invalid role', 400);
    }
  }
}
