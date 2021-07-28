import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { PrincipalType, Role, RoleAssignmentBody, roles } from './permissions.models';
import { getProjectPermissions, getTablePermissions } from './permissions.client';
import { CrgProject } from './projects.models';
import { schemaService } from './schema.service';
import { groupsService } from './groups.service';
import { CrgUser, usersService } from './users.service';

export enum BuildInRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER'
}

enum TablePermissionPoint {
  CREATE_FEATURE,
  READ_FEATURES,
  UPDATE_FEATURES,
  DELETE_FEATURES,
  EXPORT,
  DELETE
}

const tableRolesPermissionPoints = new Map<Role, TablePermissionPoint[]>([
  [
    Role.OWNER,
    [
      TablePermissionPoint.CREATE_FEATURE,
      TablePermissionPoint.READ_FEATURES,
      TablePermissionPoint.UPDATE_FEATURES,
      TablePermissionPoint.DELETE_FEATURES,
      TablePermissionPoint.EXPORT,
      TablePermissionPoint.DELETE
    ]
  ],
  [
    Role.CONTRIBUTOR,
    [
      TablePermissionPoint.CREATE_FEATURE,
      TablePermissionPoint.READ_FEATURES,
      TablePermissionPoint.UPDATE_FEATURES,
      TablePermissionPoint.DELETE_FEATURES
    ]
  ],
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
  const readOnly = schemaIdForReadonlyCheck && (await schemaService.isReadOnly(schemaIdForReadonlyCheck));

  let role = await getActualRoleInTable(datasetIdentifier, tableIdentifier);
  if (currentUser.isAdmin) {
    role = Role.OWNER;
  }
  if (roles.indexOf(role) > roles.indexOf(Role.VIEWER) && readOnly) {
    role = Role.VIEWER;
  }

  return Boolean(role) && tableRolesPermissionPoints.get(role).includes(targetPoint);
}

async function isAllowedWithProject(project: CrgProject, targetPoint: ProjectPermissionPoint): Promise<boolean> {
  const role = currentUser.isAdmin ? Role.OWNER : await getActualRoleInProject(project);

  return Boolean(role) && projectRolesPermissionPoints.get(role).includes(targetPoint);
}

export function isFeaturesReadAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.READ_FEATURES);
}

export function isFeaturesCreateAllowed(
  datasetIdentifier: string,
  tableIdentifier: string,
  schemaId: string
): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.CREATE_FEATURE, schemaId);
}

export function isFeaturesUpdateAllowed(
  datasetIdentifier: string,
  tableIdentifier: string,
  schemaId: string
): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.UPDATE_FEATURES, schemaId);
}

export function isFeaturesDeleteAllowed(
  datasetIdentifier: string,
  tableIdentifier: string,
  schemaId: string
): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.DELETE_FEATURES, schemaId);
}

export function isTableExportAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.EXPORT);
}

export function isTableDeletionAllowed(datasetIdentifier: string, tableIdentifier: string): Promise<boolean> {
  return isAllowedWithTable(datasetIdentifier, tableIdentifier, TablePermissionPoint.DELETE);
}

export function isLayersManagementAllowed(project: CrgProject = currentProject): Promise<boolean> {
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
    ({ principalId, principalType }) => principalId === filteringPrincipalId || principalType === filteringPrincipalType
  );
}

async function getActualRoleInTable(datasetId: string, tableId: string, user?: CrgUser): Promise<Role | undefined> {
  return getActualRoleIn(await getTablePermissions(datasetId, tableId), user);
}

async function getActualRoleInProject(project: CrgProject, user?: CrgUser): Promise<Role | undefined> {
  return getActualRoleIn(await getProjectPermissions(project), user);
}

async function getActualRoleIn(permissions: RoleAssignmentBody[], user?: CrgUser): Promise<Role | undefined> {
  if (!user) {
    user = await usersService.getCurrentUser();
  }

  const groupsIds = new Set((await groupsService.getUserGroups(user)).map(({ id }) => id));

  return permissions.reduce((resultRole: Role | undefined, { principalId, principalType, role }) => {
    if (
      (principalId === user.id && principalType === PrincipalType.USER) ||
      (groupsIds.has(principalId) &&
        principalType === PrincipalType.GROUP &&
        roles.indexOf(role) > roles.indexOf(resultRole))
    ) {
      resultRole = role;
    }

    return resultRole;
  }, undefined); // eslint-disable-line unicorn/no-useless-undefined
}
