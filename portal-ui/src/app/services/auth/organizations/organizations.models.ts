import { Settings } from '../../../stores/OrganizationSettings.store';
import { CrgGroup } from '../groups/groups.models';
import { CrgUserRaw } from '../users/users.models';

export interface Organization {
  id: number;
  name: string;
  status: string;
  phone: string;
  createdAt: string;
  settings: Settings;
  groups: CrgGroup[];
  users: CrgUserRaw[];
}
