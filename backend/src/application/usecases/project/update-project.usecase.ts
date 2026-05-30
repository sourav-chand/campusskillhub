import { UpdateProjectDto, UpdateProjectDtoSchema } from '../../dto/project.dto';
import { AppError } from '../../../shared/errors/AppError';

export interface IProjectRepository {
  findById(id: string): Promise<{ id: string; status: string; studentId: string } | null>;
  update(id: string, data: unknown): Promise<unknown>;
}

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, dto: UpdateProjectDto) {
    const parsed = UpdateProjectDtoSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === 'completed') {
      updateData.progress = 100;
    }

    return this.projectRepository.update(id, updateData);
  }
}
