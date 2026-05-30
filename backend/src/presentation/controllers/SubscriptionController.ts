import { Request, Response, NextFunction } from 'express';
import { CreateSubscriptionUseCase } from '@application/usecases/subscription/create-subscription.usecase';
import { GetSubscriptionsUseCase } from '@application/usecases/subscription/get-subscriptions.usecase';
import { container } from '@config/container';

export class SubscriptionController {
  constructor(
    private createSubscriptionUseCase: CreateSubscriptionUseCase,
    private getSubscriptionsUseCase: GetSubscriptionsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createSubscriptionUseCase.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getSubscriptionsUseCase.execute(req.query as never);
      res.status(200).json({ success: true, data: result.data, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getCurrent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getSubscriptionsUseCase.execute({
        collegeId: req.params.collegeId,
        status: 'active',
        page: 1,
        limit: 1,
      } as never);
      const current = result.data.length > 0 ? result.data[0] : null;
      res.status(200).json({ success: true, data: current });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { subscriptionRepository } = container.repositories;
      const result = await (subscriptionRepository as never as { update: (id: string, data: { status: string }) => Promise<unknown> }).update(req.params.id, { status: 'cancelled' });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
