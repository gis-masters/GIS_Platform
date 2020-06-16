import { CrgLayer } from '../crg/projects.models';
import { schemaService } from '../crg/schema.service';
import { localStorageService } from '../local-storage.service';

export enum BuildInRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  USER = 'USER',
}

export enum UserPermission {
  OWNER = 'OWNER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  VIEWER = 'VIEWER'
}

enum PermissionPoint {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

const permissions = new Map<UserPermission, PermissionPoint[]>([
  [UserPermission.OWNER, [
    PermissionPoint.CREATE,
    PermissionPoint.READ,
    PermissionPoint.UPDATE,
    PermissionPoint.DELETE,
    PermissionPoint.IMPORT,
    PermissionPoint.EXPORT,
  ]],
  [UserPermission.CONTRIBUTOR, [
    PermissionPoint.CREATE,
    PermissionPoint.READ,
    PermissionPoint.UPDATE,
  ]],
  [UserPermission.VIEWER, [
    PermissionPoint.READ,
  ]],
]);

async function isAllowed (layer: CrgLayer, targetPoint: PermissionPoint): Promise<boolean> {
  if (layer.type === 'raster') {
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
    return permissions.get(UserPermission.VIEWER).includes(targetPoint);
  } else {
    return permissions.get(layer.sourceData.permission).includes(targetPoint);
  }
}

const isEditContent = (): boolean => {
  const userInfo = localStorageService.getUserInfo();
  if (!userInfo) {
    return false;
  }

  return userInfo.roles &&
        (userInfo.roles.includes(BuildInRole.ORG_ADMIN) || userInfo.roles.includes(BuildInRole.GLOBAL_ADMIN));
};

export function isCreateAllowed (layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.CREATE);
}

export function isReadAllowed (layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.READ);
}

export function isUpdateAllowed (layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.UPDATE);
}

export function isDeleteAllowed (layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.DELETE);
}

export function isExportAllowed (layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.EXPORT);
}

export function isImportAllowed (layer: CrgLayer): Promise<boolean> {
  return isAllowed(layer, PermissionPoint.IMPORT);
}

export const isManagementAllowed = (): boolean => isEditContent();
