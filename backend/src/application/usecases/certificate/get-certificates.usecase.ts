import { CertificateResponseDto } from '../../dto/certificate.dto';
import { PaginatedResponseDto, PaginationDto, PaginationDtoSchema } from '../../dto/pagination.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface ICertificateRepository {
  findAll(filter: {
    studentId?: string;
    courseId?: string;
    collegeId?: string;
    isValid?: boolean;
    page: number;
    limit: number;
  }): Promise<{ data: CertificateResponseDto[]; total: number }>;
}

export class GetCertificatesUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(filter: {
    studentId?: string;
    courseId?: string;
    collegeId?: string;
    isValid?: boolean;
  } & PaginationDto): Promise<PaginatedResponseDto<CertificateResponseDto>> {
    const paginationParsed = PaginationDtoSchema.safeParse(filter);
    if (!paginationParsed.success) {
      throw new AppError(paginationParsed.error.errors[0].message, 400);
    }

    const { data, total } = await this.certificateRepository.findAll(filter);
    return new PaginatedResponseDto(data, total, paginationParsed.data);
  }
}
