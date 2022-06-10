import { User } from '../entity/user.entity';

export interface UserResultCount {
  countAll: number;
  page: number;
  perPage: number;
  rows: User[];
}
