import { MarkAttendanceDto, MarkAttendanceDtoSchema } from '../../dto/attendance.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAttendanceRepository {
  findExisting(studentId: string, courseId: string, date: string): Promise<unknown>;
  create(data: unknown): Promise<unknown>;
}

export interface ICourseRepository {
  findById(id: string): Promise<{ id: string; collegeId: string } | null>;
}

export class MarkAttendanceUseCase {
  constructor(
    private attendanceRepository: IAttendanceRepository,
    private courseRepository: ICourseRepository,
  ) {}

  async execute(dto: MarkAttendanceDto) {
    const parsed = MarkAttendanceDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const dateStr = new Date(parsed.data.date).toISOString().split('T')[0];

    const existing = await this.attendanceRepository.findExisting(
      parsed.data.studentId,
      parsed.data.courseId,
      dateStr,
    );
    if (existing) {
      throw new AppError('Attendance already marked for this student on this date', 409);
    }

    const course = await this.courseRepository.findById(parsed.data.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return this.attendanceRepository.create({
      ...parsed.data,
      date: new Date(parsed.data.date),
    });
  }
}
