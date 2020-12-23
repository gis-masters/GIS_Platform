import { currentUser } from '../../stores/CurrentUser.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { PrincipalType, Role, RoleAssignmentBody, roles } from './permissions.models';
import { getProjectPermissions, getTablePermissions } from './permissions.client';
import { CrgLayer, CrgProject } from './projects.models';
import { schemaService } from './schema.service';
import { groupsService } from './groups.service';
import { CrgUser, usersService } from './users.service';

export enum BuildInRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER'
}

enum LayerPermissionPoint {
  CREATE_FEATURE,
  READ_FEATURES,
  UPDATE_FEATURES,
  DELETE_FEATURES,
  EXPORT
}

const layerRolesPermissionPoints = new Map<Role, LayerPermissionPoint[]>([
  [
    Role.OWNER,
    [
      LayerPermissionPoint.CREATE_FEATURE,
      LayerPermissionPoint.READ_FEATURES,
      LayerPermissionPoint.UPDATE_FEATURES,
      LayerPermissionPoint.DELETE_FEATURES,
      LayerPermissionPoint.EXPORT
    ]
  ],
  [
    Role.CONTRIBUTOR,
    [
      LayerPermissionPoint.CREATE_FEATURE,
      LayerPermissionPoint.READ_FEATURES,
      LayerPermissionPoint.UPDATE_FEATURES,
      LayerPermissionPoint.DELETE_FEATURES
    ]
  ],
  [Role.VIEWER, [LayerPermissionPoint.READ_FEATURES]]
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

async function isAllowedWithLayer(layer: CrgLayer, targetPoint: LayerPermissionPoint): Promise<boolean> {
  if (layer.type !== 'vector') {
    return true;
  }

  let readOnly: boolean;
  try {
    readOnly = (await schemaService.getSchema(layer.schemaId)).readOnly;
  } catch (e) {
    readOnly = true;
  }

  let role = await getActualRoleInTable(layer.dataset, layer.internalName);
  if (currentUser.isAdmin) {
    role = Role.OWNER;
  }
  if (roles.indexOf(role) > roles.indexOf(Role.VIEWER) && readOnly) {
    role = Role.VIEWER;
  }

  return Boolean(role) && layerRolesPermissionPoints.get(role).includes(targetPoint);
}

async function isAllowedWithProject(project: CrgProject, targetPoint: ProjectPermissionPoint): Promise<boolean> {
  const role = currentUser.isAdmin ? Role.OWNER : await getActualRoleInProject(project);

  return Boolean(role) && projectRolesPermissionPoints.get(role).includes(targetPoint);
}

export function isFeaturesReadAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowedWithLayer(layer, LayerPermissionPoint.READ_FEATURES);
}

export function isFeaturesCreateAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowedWithLayer(layer, LayerPermissionPoint.CREATE_FEATURE);
}

export function isFeaturesUpdateAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowedWithLayer(layer, LayerPermissionPoint.UPDATE_FEATURES);
}

export function isFeaturesDeleteAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowedWithLayer(layer, LayerPermissionPoint.DELETE_FEATURES);
}

export function isLayerExportAllowed(layer: CrgLayer): Promise<boolean> {
  return isAllowedWithLayer(layer, LayerPermissionPoint.EXPORT);
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

  const groupsIds = (await groupsService.getUserGroups(user)).map(({ id }) => id);

  return permissions.reduce((resultRole: Role | undefined, { principalId, principalType, role }) => {
    if (
      (principalId === user.id && principalType === PrincipalType.USER) ||
      (groupsIds.includes(principalId) &&
        principalType === PrincipalType.GROUP &&
        roles.indexOf(role) > roles.indexOf(resultRole))
    ) {
      resultRole = role;
    }

    return resultRole;
  }, undefined);
}
