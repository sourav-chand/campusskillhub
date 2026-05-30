import { Request, Response, NextFunction } from 'express';
import { CreateAssignmentUseCase } from '@application/usecases/assignment/create-assignment.usecase';
import { SubmitAssignmentUseCase } from '@application/usecases/assignment/submit-assignment.usecase';
import { GradeAssignmentUseCase } from '@application/usecases/assignment/grade-assignment.usecase';
import { ListAssignmentsUseCase } from '@application/usecases/assignment/list-assignments.usecase';
import { container } from '@config/container';

export class AssignmentController {
  constructor(
    private createAssignmentUseCase: CreateAssignmentUseCase,
    private submitAssignmentUseCase: SubmitAssignmentUseCase,
    private gradeAssignmentUseCase: GradeAssignmentUseCase,
    private listAssignmentsUseCase: ListAssignmentsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createAssignmentUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.submitAssignmentUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  grade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.gradeAssignmentUseCase.execute(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  listByCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAssignmentsUseCase.execute({
        courseId: req.params.courseId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  listByStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.listAssignmentsUseCase.execute({
        studentId: req.params.studentId,
        ...req.query,
      } as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { assignmentRepository } = container.repositories;
      const assignment = await (assignmentRepository as never as { findById: (id: string) => Promise<unknown> }).findById(req.params.id);
      res.status(200).json({ success: true, data: assignment });
    } catch (error) {
      next(error);
    }
  };
}
