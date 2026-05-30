import { GradeAssignmentDto, GradeAssignmentDtoSchema } from '../../dto/assignment.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IAssignmentRepository {
  findSubmissionById(id: string): Promise<{
    id: string; assignmentId: string; status: string;
  } | null>;
  findById(id: string): Promise<{ id: string; maxScore: number; passingScore: number } | null>;
  gradeSubmission(id: string, data: unknown): Promise<unknown>;
}

export class GradeAssignmentUseCase {
  constructor(private assignmentRepository: IAssignmentRepository) {}

  async execute(dto: GradeAssignmentDto) {
    const parsed = GradeAssignmentDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const submission = await this.assignmentRepository.findSubmissionById(parsed.data.submissionId);
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    if (submission.status === 'graded') {
      throw new AppError('Submission has already been graded', 400);
    }

    const assignment = await this.assignmentRepository.findById(submission.assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    if (parsed.data.score > assignment.maxScore) {
      throw new AppError(`Score cannot exceed ${assignment.maxScore}`, 400);
    }

    const passed = parsed.data.score >= assignment.passingScore;

    return this.assignmentRepository.gradeSubmission(parsed.data.submissionId, {
      score: parsed.data.score,
      feedback: parsed.data.feedback,
      gradedById: parsed.data.gradedById,
      gradedAt: new Date(),
      status: 'graded',
      passed,
    });
  }
}
