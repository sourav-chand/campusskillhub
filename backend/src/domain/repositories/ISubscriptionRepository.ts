import { Subscription } from '../entities/Subscription';

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  create(subscription: Subscription): Promise<Subscription>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Subscription[]>;
  findByCollege(collegeId: string): Promise<Subscription[]>;
  findActive(collegeId: string): Promise<Subscription | null>;
  getRevenue(startDate: Date, endDate: Date): Promise<number>;
}
