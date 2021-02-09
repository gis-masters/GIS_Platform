import { DataEntityType } from '../data.service';

export enum BuildInRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER'
}

export enum Role {
  OWNER = 'OWNER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  VIEWER = 'VIEWER'
}

export const roles: Role[] = [Role.VIEWER, Role.CONTRIBUTOR, Role.OWNER];
export const projectRoles: Role[] = [Role.VIEWER, Role.OWNER];

export const rolesTitles: { [key in Role]: string } = {
  VIEWER: 'Чтение',
  CONTRIBUTOR: 'Запись',
  OWNER: 'Владелец'
};

export enum PrincipalType {
  USER = 'user',
  GROUP = 'group'
}

export interface RoleAssignmentBody {
  id?: number;
  createdAt?: string;
  principalId: number;
  principalType: PrincipalType;
  role: Role;
}

export interface ResourcePermissions {
  createdAt: string;
  identifier: string;
  type: DataEntityType;
  permissions?: RoleAssignmentBody[];
}
