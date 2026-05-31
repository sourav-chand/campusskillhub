import { Request, Response, NextFunction } from 'express';
import { CreateMCQUseCase } from '@application/usecases/assessment/create-mcq.usecase';
import { CreateCodingUseCase } from '@application/usecases/assessment/create-coding.usecase';
import { SubmitMCQUseCase } from '@application/usecases/assessment/submit-mcq.usecase';
import { SubmitCodingUseCase } from '@application/usecases/assessment/submit-coding.usecase';
import { GetResultsUseCase } from '@application/usecases/assessment/get-results.usecase';
import { GetLeaderboardUseCase } from '@application/usecases/assessment/get-leaderboard.usecase';
import { ListMCQTestsUseCase } from '@application/usecases/assessment/list-mcq.usecase';
import { ListCodingAssessmentsUseCase } from '@application/usecases/assessment/list-coding.usecase';

export class AssessmentController {
  constructor(
    private createMCQUseCase: CreateMCQUseCase,
    private createCodingUseCase: CreateCodingUseCase,
    private submitMCQUseCase: SubmitMCQUseCase,
    private submitCodingUseCase: SubmitCodingUseCase,
    private getResultsUseCase: GetResultsUseCase,
    private getLeaderboardUseCase: GetLeaderboardUseCase,
    private listMCQTestsUseCase: ListMCQTestsUseCase,
    private listCodingAssessmentsUseCase: ListCodingAssessmentsUseCase,
  ) {}

  createMCQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createMCQUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  submitMCQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.submitMCQUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getMCQResults = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getResultsUseCase.execute({
        testId: req.params.testId,
        type: 'mcq',
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  createCoding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createCodingUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  submitCoding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.submitCodingUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getCodingResults = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getResultsUseCase.execute({
        testId: req.params.assessmentId,
        type: 'coding',
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getLeaderboardUseCase.execute({
        testId: req.params.testId,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getAllMCQ = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listMCQTestsUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result.data, pagination: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getAllCoding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listCodingAssessmentsUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result.data, pagination: result.meta });
    } catch (error) {
      next(error);
    }
  };
}
