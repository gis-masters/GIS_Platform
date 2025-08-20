import { OrgSettings } from '../../../stores/OrganizationSettings.store';
import { CrgGroup } from '../groups/groups.models';
import { CrgUserRaw } from '../users/users.models';

export interface OccupiedStorage {
  totalFiles: number;
  allocated: string;
}

export interface Organization {
  id: number;
  name: string;
  status: string;
  phone: string;
  createdAt: string;
  settings: OrgSettings;
  groups: CrgGroup[];
  users: CrgUserRaw[];
  description?: string;
}

export type OrganizationInformation = Pick<Organization, 'name' | 'phone' | 'description'>;
