import { ApiLink } from '../../models';
import { CrgUser } from '../users/users.models';

export interface CrgGroup {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  users: Pick<CrgUser, 'id'>[];
  _links?: { [key: string]: ApiLink }[];
}

export type GroupData = Pick<CrgGroup, 'name' | 'description'>;
