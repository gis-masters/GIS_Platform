import { type CrgGroup } from '../../services/auth/groups/groups.models';

export interface CrgGroupExtended extends CrgGroup {
  usersCount: number;
}
