import { AppError } from '../../../shared/errors/AppError';
import { AttendanceReportDto } from '../../dto/report.dto';

export interface IAttendanceRepository {
  getMonthlyReport(params: {
    collegeId?: string;
    courseId?: string;
    month: number;
    year: number;
  }): Promise<AttendanceReportDto>;
}

export class GetMonthlyReportUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(params: {
    collegeId?: string;
    courseId?: string;
    month: number;
    year: number;
  }): Promise<AttendanceReportDto> {
    const { month, year } = params;

    if (!month || !year) {
      throw new AppError('Month and year are required', 400);
    }

    if (month < 1 || month > 12) {
      throw new AppError('Invalid month', 400);
    }

    if (year < 2020 || year > 2100) {
      throw new AppError('Invalid year', 400);
    }

    return this.attendanceRepository.getMonthlyReport(params);
  }
}
