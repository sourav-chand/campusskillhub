import { Request, Response, NextFunction } from 'express';
import { CreateProjectUseCase } from '@application/usecases/project/create-project.usecase';
import { UpdateProjectUseCase } from '@application/usecases/project/update-project.usecase';
import { AddMilestoneUseCase } from '@application/usecases/project/add-milestone.usecase';
import { AddFeedbackUseCase } from '@application/usecases/project/add-feedback.usecase';
import { GetProjectsUseCase } from '@application/usecases/project/get-projects.usecase';
import { container } from '@config/container';

export class ProjectController {
  constructor(
    private createProjectUseCase: CreateProjectUseCase,
    private updateProjectUseCase: UpdateProjectUseCase,
    private addMilestoneUseCase: AddMilestoneUseCase,
    private addFeedbackUseCase: AddFeedbackUseCase,
    private getProjectsUseCase: GetProjectsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createProjectUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateProjectUseCase.execute(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  addMilestone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.addMilestoneUseCase.execute(req.params.id, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  addFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.addFeedbackUseCase.execute({
        projectId: req.params.id,
        ...req.body,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getProjectsUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectRepository } = container.repositories;
      const project = await (projectRepository as never as { findById: (id: string) => Promise<unknown> }).findById(req.params.id);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  };
}
