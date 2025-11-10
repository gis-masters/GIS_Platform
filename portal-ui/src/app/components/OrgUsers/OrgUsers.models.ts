import { type CrgGroup } from '../../services/auth/groups/groups.models';
import { type CrgUser } from '../../services/auth/users/users.models';

export interface CrgUserExtended extends CrgUser {
  groups: CrgGroup[];
  groupsString: string;
}
