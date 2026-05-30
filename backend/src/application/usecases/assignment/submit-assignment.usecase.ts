import { SubmitAssignmentDto, SubmitAssignmentDtoSchema } from '../../dto/assignment.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAssignmentRepository {
  findById(id: string): Promise<{ id: string; dueDate: Date } | null>;
  findSubmission(assignmentId: string, studentId: string): Promise<unknown>;
  createSubmission(data: unknown): Promise<unknown>;
}

export class SubmitAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) {}

  async execute(dto: SubmitAssignmentDto) {
    const parsed = SubmitAssignmentDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const assignment = await this.assignmentRepository.findById(parsed.data.assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    const existingSubmission = await this.assignmentRepository.findSubmission(
      parsed.data.assignmentId,
      parsed.data.studentId,
    );
    if (existingSubmission) {
      throw new AppError('You have already submitted this assignment', 409);
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    return this.assignmentRepository.createSubmission({
      ...parsed.data,
      submittedAt: new Date(),
      isLate,
      status: 'submitted',
    });
  }
}
