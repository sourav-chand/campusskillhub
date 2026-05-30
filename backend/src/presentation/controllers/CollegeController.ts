import { Request, Response, NextFunction } from 'express';
import { CreateCollegeUseCase } from '@application/usecases/college/create-college.usecase';
import { UpdateCollegeUseCase } from '@application/usecases/college/update-college.usecase';
import { ApproveCollegeUseCase } from '@application/usecases/college/approve-college.usecase';
import { GetCollegeUseCase } from '@application/usecases/college/get-college.usecase';
import { ListCollegesUseCase } from '@application/usecases/college/list-colleges.usecase';

export class CollegeController {
  constructor(
    private createCollegeUseCase: CreateCollegeUseCase,
    private updateCollegeUseCase: UpdateCollegeUseCase,
    private approveCollegeUseCase: ApproveCollegeUseCase,
    private getCollegeUseCase: GetCollegeUseCase,
    private listCollegesUseCase: ListCollegesUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createCollegeUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.updateCollegeUseCase.execute(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.approveCollegeUseCase.execute(req.params.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getCollegeUseCase.execute(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listCollegesUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { collegeRepository } = await import('@config/container');
      const stats = await (collegeRepository as never as { getStats: (id: string) => Promise<unknown> }).getStats(req.params.id);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };
}
