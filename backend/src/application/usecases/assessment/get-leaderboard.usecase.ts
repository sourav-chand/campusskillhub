import { AppError } from '../../../shared/errors/AppError';

export interface IAssessmentRepository {
  getLeaderboard(testId: string, limit?: number): Promise<unknown[]>;
}

export class GetLeaderboardUseCase {
  constructor(private assessmentRepository: IAssessmentRepository) {}

  async execute(params: { testId: string; limit?: number }) {
    const { testId, limit = 10 } = params;

    if (!testId) {
      throw new AppError('Test ID is required', 400);
    }

    return this.assessmentRepository.getLeaderboard(testId, limit);
  }
}
