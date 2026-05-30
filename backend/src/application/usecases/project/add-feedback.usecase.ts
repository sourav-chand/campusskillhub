import { z } from 'zod';
import { AppError } from '../../../shared/errors/AppError';

const AddFeedbackSchema = z.object({
  projectId: z.string().uuid(),
  mentorId: z.string().uuid(),
  feedback: z.string().min(10).max(5000),
  score: z.number().int().min(0).max(100).optional(),
});

type AddFeedbackDto = z.infer<typeof AddFeedbackSchema>;

export interface IProjectRepository {
  findById(id: string): Promise<{ id: string; mentorId?: string } | null>;
  addFeedback(projectId: string, data: {
    mentorId: string;
    feedback: string;
    score?: number;
  }): Promise<unknown>;
}

export class AddFeedbackUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(dto: AddFeedbackDto) {
    const parsed = AddFeedbackSchema.safeParse(dto);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const project = await this.projectRepository.findById(parsed.data.projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    if (!project.mentorId) {
      throw new AppError('No mentor assigned to this project', 400);
    }

    return this.projectRepository.addFeedback(parsed.data.projectId, {
      mentorId: parsed.data.mentorId,
      feedback: parsed.data.feedback,
      score: parsed.data.score,
    });
  }
}
