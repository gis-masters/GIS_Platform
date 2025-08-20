import { BuiltInRole } from '../../permissions/permissions.models';

export interface CrgUser {
  id: number;
  email: string;
  geoserverLogin: string;
  name: string;
  surname: string;
  middleName?: string;
  job?: string;
  department?: string;
  phone?: string;
  login: string;
  enabled: boolean;
  authorities: BuiltInRole[];
  createdAt: string;
  password?: string;
  bossId?: number;
}

export interface MinimizedCrgUser {
  id: number;
  email: string;
  name: string;
  surname: string;
  middleName?: string;
}

export interface CrgUserRaw extends Omit<CrgUser, 'authorities'> {
  authorities: { authority: BuiltInRole }[];
}

export type NewUserData = Pick<
  CrgUser,
  'email' | 'name' | 'surname' | 'middleName' | 'job' | 'department' | 'phone' | 'password' | 'enabled'
>;

export interface OrgInfo extends CrgUser {
  orgName: string;
  orgId: number;
}
