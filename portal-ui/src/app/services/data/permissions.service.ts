import { AxiosError } from 'axios';

import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { PrincipalType, Role, RoleAssignmentBody, roles } from './permissions.models';
import { CrgProject } from '../gis/projects.models';
import { schemaService } from './schema.service';
import { VectorTable, getVectorTable } from './data.service';
import { getLibraryRecord } from './doc-library.service';

export enum BuildInRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER'
}

enum TablePermissionPoint {
  READ_FEATURES,
  UPDATE_FEATURES,
  EXPORT,
  DELETE
}

const tableRolesPermissionPoints = new Map<Role, TablePermissionPoint[]>([
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

enum ProjectPermissionPoint {
  READ,
  UPDATE,
  DELETE,
  MANAGE_LAYERS
}

const projectRolesPermissionPoints = new Map<Role, ProjectPermissionPoint[]>([
  [
    Role.OWNER,
    [
      ProjectPermissionPoint.READ,
      ProjectPermissionPoint.UPDATE,
      ProjectPermissionPoint.DELETE,
      ProjectPermissionPoint.MANAGE_LAYERS
    ]
  ],
  [Role.CONTRIBUTOR, [ProjectPermissionPoint.READ, ProjectPermissionPoint.MANAGE_LAYERS]],
  [Role.VIEWER, [ProjectPermissionPoint.READ]]
]);

async function isAllowedWithTable(
  datasetIdentifier: string,
  tableIdentifier: string,
  targetPoint: TablePermissionPoint,
  schemaIdForReadonlyCheck?: string
): Promise<boolean> {
  const schema = schemaIdForReadonlyCheck && (await schemaService.getSchema(schemaIdForReadonlyCheck));
  const readOnly = schema?.readOnly;

  let table: VectorTable;
  try {
    table = await getVectorTable(datasetIdentifier, tableIdentifier);
  } catch (error) {
    const err = error as AxiosError;

    if (err.response.status !== 403) {
      throw err;
    }
  }

  let role = table?.role;

  if (currentUser.isAdmin) {
    role = Role.OWNER;
  }
  if (roles.indexOf(role) > roles.indexOf(Role.VIEWER) && readOnly) {
    role = Role.VIEWER;
  }

  return Boolean(role) && tableRolesPermissionPoints.get(role).includes(targetPoint);
}

function isAllowedWithProject(project: CrgProject, targetPoint: ProjectPermissionPoint): boolean {
  const role = currentUser.isAdmin ? Role.OWNER : project.role;

  return Boolean(role) && projectRolesPermissionPoints.get(role).includes(targetPoint);
}

export function isFeaturesReadAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.READ_FEATURES);
}

export async function isRasterReadAllowed(libraryId: string, recordId: number): Promise<boolean> {
  try {
    const raster = await getLibraryRecord(libraryId, recordId);

    return Boolean(raster.role);
  } catch {
    return false;
  }
}

export function isFeaturesUpdateAllowed(
  datasetIdentifier: string,
  tableIdentifier: string,
  schemaId: string
): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.UPDATE_FEATURES, schemaId);
}

export function isTableExportAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.EXPORT);
}

export function isTableDeletionAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.DELETE);
}

export function isLayersManagementAllowed(project: CrgProject = currentProject): boolean {
  return isAllowedWithProject(project, ProjectPermissionPoint.MANAGE_LAYERS);
}

export function filterOutPrincipal(
  filteringPrincipalId: number,
  filteringPrincipalType: PrincipalType,
  permissions: RoleAssignmentBody[]
): RoleAssignmentBody[] {
  return permissions.filter(
    ({ principalId, principalType }) => principalId !== filteringPrincipalId || principalType !== filteringPrincipalType
  );
}

export function filterByPrincipal(
  filteringPrincipalId: number,
  filteringPrincipalType: PrincipalType,
  permissions: RoleAssignmentBody[]
): RoleAssignmentBody[] {
  return permissions.filter(
    ({ principalId, principalType }) => principalId === filteringPrincipalId && principalType === filteringPrincipalType
  );
}
