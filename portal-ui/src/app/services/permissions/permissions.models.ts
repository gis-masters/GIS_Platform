import { DataEntityType } from '../data/vectorData/vectorData.models';

export enum PermissionType {
  GIS,
  DATA
}

export enum BuiltInRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER'
}

export enum Role {
  OWNER = 'OWNER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  VIEWER = 'VIEWER'
}

export enum TablePermissionPoint {
  READ_FEATURES,
  UPDATE_FEATURES,
  EXPORT,
  DELETE
}

export enum ActionTypes {
  EDIT = 'Редактирование',
  DELETE = 'Удаление',
  MOVE = 'Перемещение',
  IMPORT_KPT = 'Импортирование'
}

export enum DataTypes {
  DATASET = 'Набор данных',
  DOC = 'Документ',
  VECTOR_TABLE = 'Векторная таблица',
  PROJECT = 'Проект',
  PROJECT_FOLDER = 'Папка проекта'
}

export const roles: Role[] = [Role.VIEWER, Role.CONTRIBUTOR, Role.OWNER];
export const gisRoles: Role[] = [Role.VIEWER, Role.OWNER];

export const tableRolesPermissionPoints = new Map<Role, TablePermissionPoint[]>([
  [
    Role.OWNER,
    [
      TablePermissionPoint.READ_FEATURES,
      TablePermissionPoint.UPDATE_FEATURES,
      TablePermissionPoint.EXPORT,
      TablePermissionPoint.DELETE
    ]
  ],
  [Role.CONTRIBUTOR, [TablePermissionPoint.READ_FEATURES, TablePermissionPoint.UPDATE_FEATURES]],
  [Role.VIEWER, [TablePermissionPoint.READ_FEATURES]]
]);

export enum ProjectPermissionPoint {
  READ,
  UPDATE,
  DELETE,
  MANAGE_LAYERS
}

export const projectRolesPermissionPoints = new Map<Role, ProjectPermissionPoint[]>([
  [
    Role.OWNER,
    [
      ProjectPermissionPoint.READ,
      ProjectPermissionPoint.UPDATE,
      ProjectPermissionPoint.DELETE,
      ProjectPermissionPoint.MANAGE_LAYERS
    ]
  ],
  [Role.VIEWER, [ProjectPermissionPoint.READ]]
]);

export const rolesTitles: { [key in Role]: string } = {
  VIEWER: 'Чтение',
  CONTRIBUTOR: 'Запись',
  OWNER: 'Владение'
};

export enum PrincipalType {
  USER = 'user',
  GROUP = 'group'
}

export function isPrincipalType(value: unknown): value is PrincipalType {
  return value === PrincipalType.USER || value === PrincipalType.GROUP;
}

export interface RoleAssignmentBody {
  id?: number;
  createdAt?: string;
  principalId: number;
  principalType: PrincipalType;
  role: Role;
}

export interface PermissionsListItem<T = unknown> {
  entity: T;
  permissions: RoleAssignmentBody[];
  broken?: boolean;
}

export interface ResourcePermissions {
  createdAt: string;
  identifier: string;
  type: DataEntityType;
  permissions?: RoleAssignmentBody[];
}
