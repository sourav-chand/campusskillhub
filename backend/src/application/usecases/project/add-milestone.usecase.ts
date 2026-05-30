import { AddMilestoneDto, AddMilestoneDtoSchema } from '../../dto/project.dto';
import { AppError } from '../../../shared/errors/AppError';
import { calculateProgress } from '../../../shared/utils/helpers';

export interface IProjectRepository {
  findById(id: string): Promise<{ id: string } | null>;
  addMilestone(projectId: string, data: unknown): Promise<unknown>;
  countMilestones(projectId: string): Promise<number>;
  countCompletedMilestones(projectId: string): Promise<number>;
  updateProjectProgress(projectId: string, progress: number): Promise<void>;
}

export class AddMilestoneUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(projectId: string, dto: AddMilestoneDto) {
    const parsed = AddMilestoneDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const milestone = await this.projectRepository.addMilestone(projectId, {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      status: 'pending',
    });

    const totalMilestones = await this.projectRepository.countMilestones(projectId);
    const completedMilestones = await this.projectRepository.countCompletedMilestones(projectId);
    const progress = calculateProgress(completedMilestones, totalMilestones);
    await this.projectRepository.updateProjectProgress(projectId, progress);

    return milestone;
  }
}
