import { CrgLayer, CrgProject, CrgSource } from './projects.models';
import { schemaService } from './schema.service';
import { PageableResponse } from '../models';
import { services } from '../services';
import { serverProperties } from '../server-properties.service';
import { Toast } from '../../components/Toast/Toast';
import { http } from '../http.service';

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

  const sourceData = await getLayerSourceData(layer);

  if (!layer || !targetPoint || !sourceData) {
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
    return permissions.get(sourceData.permission).includes(targetPoint);
  }
}

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

async function getPermissionsUrl(project: CrgProject, layer?: CrgLayer): Promise<string> {
  if (layer) {
    const dataServerUrl = await serverProperties.dataUrl;

    return `${dataServerUrl}/datasets/${layer.dataset}/tables/${layer.internalName}/roleAssignment`;
  } else {
    const projectsUrl = await serverProperties.projectsUrl;

    return `${projectsUrl}/${project.id}/permissions`;
  }
}

async function getLayerSourceData(layer: CrgLayer): Promise<CrgSource | null> {
  try {
    return await http.get<CrgSource>(`${await serverProperties.baseUrl}${layer.dataSourceUri}`);
  } catch (e) {
    return null;
  }
}

function handleSavingError(
  e: any,
  actionType: string,
  payload: RoleAssignmentBody,
  project: CrgProject,
  layer?: CrgLayer
) {
  const errText =
    `Не удалось ${actionType} разрешение "${payload.role}" для ` +
    (layer
      ? `для слоя "${layer.title}" в проекте "${project.name}" (${layer.complexName})`
      : `для проекта "${project.name}"`);
  Toast.warn(errText);
  services.logger.error(errText, e);
}

export async function getPermissions(project: CrgProject, layer?: CrgLayer): Promise<RoleAssignmentBody[]> {
  const url = await getPermissionsUrl(project, layer);

  if (layer) {
    const response = await http.get<PageableResponse<{ permissions: RoleAssignmentBody[] }>>(url, {
      params: { size: '10000' }
    });

    return response._embedded?.permissions || [];
  } else {
    const response = await http.get<RoleAssignmentBody[]>(url);

    return response;
  }
}

export async function addPermission(payload: RoleAssignmentBody, project: CrgProject, layer?: CrgLayer) {
  const url = await getPermissionsUrl(project, layer);

  try {
    await http.post(url, payload);
  } catch (e) {
    handleSavingError(e, 'добавить', payload, project, layer);
  }
}

export async function removePermission(payload: RoleAssignmentBody, project: CrgProject, layer?: CrgLayer) {
  const url = await getPermissionsUrl(project, layer);

  try {
    await http.delete(`${url}/${payload.id}`);
  } catch (e) {
    handleSavingError(e, 'удалить', payload, project, layer);
  }
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
