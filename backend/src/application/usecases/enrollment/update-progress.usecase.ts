import { AppError } from '../../../shared/errors/AppError';
import { calculateProgress } from '../../../shared/utils/helpers';

export interface IEnrollmentRepository {
  findById(id: string): Promise<{
    id: string; completedModules: number; totalModules: number; status: string;
  } | null>;
  update(id: string, data: unknown): Promise<unknown>;
}

export class UpdateProgressUseCase {
  constructor(private enrollmentRepository: IEnrollmentRepository) {}

  async execute(params: {
    enrollmentId: string;
    completedModules?: number;
    totalModules?: number;
    status?: string;
  }) {
    const { enrollmentId, completedModules, totalModules, status } = params;

    if (!enrollmentId) {
      throw new AppError('Enrollment ID is required', 400);
    }

    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const updateData: Record<string, unknown> = {};

    const modules = completedModules ?? enrollment.completedModules;
    const total = totalModules ?? enrollment.totalModules;
    updateData.progress = calculateProgress(modules, total);
    updateData.completedModules = modules;

    if (totalModules) {
      updateData.totalModules = totalModules;
    }

    if (status) {
      updateData.status = status;
    }

    if (updateData.progress === 100 || status === 'completed') {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
    }

    return this.enrollmentRepository.update(enrollmentId, updateData);
  }
}
