import { UserResultOneInterface } from './user-result-one.interface';

export interface UserResultsCountInterface {
  countAll: number;
  page: number;
  perPage: number;
  totalPage: number;
  rows: UserResultOneInterface[];
}
