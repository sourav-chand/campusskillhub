import { AttendanceFilterDto, AttendanceFilterDtoSchema, AttendanceResponseDto } from '../../dto/attendance.dto';
import { PaginatedResponseDto } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAttendanceRepository {
  findAll(filter: AttendanceFilterDto): Promise<{ data: AttendanceResponseDto[]; total: number }>;
}

export class GetAttendanceUseCase {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(filter: AttendanceFilterDto): Promise<PaginatedResponseDto<AttendanceResponseDto>> {
    const parsed = AttendanceFilterDtoSchema.safeParse(filter);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.attendanceRepository.findAll(parsed.data);
    return new PaginatedResponseDto(data, total, parsed.data);
  }
}
