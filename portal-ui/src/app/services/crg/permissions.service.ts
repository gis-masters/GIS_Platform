import { HttpParams } from '@angular/common/http';

import { CrgLayer, Project } from './projects.models';
import { schemaService } from './schema.service';
import { localStorageService } from '../local-storage.service';
import { CrgApiPageableResponse } from './models';
import { services } from '../services';
import { serverProperties } from '../server-properties.service';
import { communicationService } from '../communication.service';

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

enum PermissionPoint {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT'
}

export enum PrincipalType {
  USER = 'user',
  GROUP = 'group',
  WRONG = 'WRONG'
}

export interface RoleAssignmentBody {
  id?: number;
  principalId: number | string;
  principalType: PrincipalType;
  role: Role;
}

const permissions = new Map<Role, PermissionPoint[]>([
  [
    Role.OWNER,
    [
      PermissionPoint.CREATE,
      PermissionPoint.READ,
      PermissionPoint.UPDATE,
      PermissionPoint.DELETE,
      PermissionPoint.IMPORT,
      PermissionPoint.EXPORT
    ]
  ],
  [Role.CONTRIBUTOR, [PermissionPoint.CREATE, PermissionPoint.READ, PermissionPoint.UPDATE]],
  [Role.VIEWER, [PermissionPoint.READ]]
]);

async function isAllowed(layer: CrgLayer, targetPoint: PermissionPoint): Promise<boolean> {
  if (layer.type !== 'vector') {
    return true;
  }

  if (!layer || !targetPoint || !layer.sourceData) {
    return false;
  }

  let readOnly: boolean;
  try {
    readOnly = (await schemaService.getSchema(layer.schemaId)).readOnly;
  } catch (e) {
    readOnly = true;
  }

  if (readOnly) {
    return permissions.get(Role.VIEWER).includes(targetPoint);
  } else {
    return permissions.get(layer.sourceData.permission).includes(targetPoint);
  }
}

const isEditContent = (): boolean => {
  const userInfo = localStorageService.getUserInfo();
  if (!userInfo) {
    return false;
  }

  return (
    userInfo.roles &&
    (userInfo.roles.includes(BuildInRole.ORG_ADMIN) || userInfo.roles.includes(BuildInRole.GLOBAL_ADMIN))
  );
};

export function isCreateAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.CREATE);
}

export function isReadAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.READ);
}

export function isUpdateAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.UPDATE);
}

export function isDeleteAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.DELETE);
}

export function isExportAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.EXPORT);
}

export function isImportAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.IMPORT);
}

export function isManagementAllowed(): boolean {
  return isEditContent();
}

async function getPermissionsUrl(project: Project, layer?: CrgLayer): Promise<string> {
  if (layer) {
    const dataServerUrl = await serverProperties.dataServerUrl;
    return `${dataServerUrl}/schemas/${project.internalName}/tables/${layer.internalName}/roleAssignment`;
  } else {
    const projectsUrl = await serverProperties.projectsUrl;
    return `${projectsUrl}/${project.id}/permissions`;
  }
}

export async function getPermissions(project: Project, layer?: CrgLayer): Promise<RoleAssignmentBody[]> {
  const url = await getPermissionsUrl(project, layer);

  if (layer) {
    const params = new HttpParams().set('size', '10000');
    const response = await services.httpq.get<CrgApiPageableResponse<RoleAssignmentBody>>(url, { params });
    return response.content;
  } else {
    const response = await services.httpq.get<RoleAssignmentBody[]>(url);
    return response;
  }
}

export async function addPermission(payload: RoleAssignmentBody, project: Project, layer?: CrgLayer) {
  const url = await getPermissionsUrl(project, layer);

  await services.httpq.post(url, payload);

  communicationService.permissionsUpdated.emit();
}

export async function removePermission(payload: RoleAssignmentBody, project: Project, layer?: CrgLayer) {
  const url = await getPermissionsUrl(project, layer);

  await services.httpq.delete(`${url}/${payload.id}`);

  communicationService.permissionsUpdated.emit();
}

export function getSetOfRoleAssignments(
  principalId: number,
  principalType: PrincipalType,
  role: Role,
  isProject: boolean
): RoleAssignmentBody[] {
  if (!isProject && projectRoles.indexOf(role) === -1) {
    role = projectRoles[0];
  }

  const currRoles = isProject ? roles.slice(0, roles.indexOf(role) + 1) : [role];

  return currRoles.map(roleName => ({
    principalType,
    principalId,
    role: roleName
  }));
}
