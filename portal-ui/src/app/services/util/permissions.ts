import {CrgLayer} from '../crg/projects.models';

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

const isAllowed = (layer: CrgLayer, targetPoint: PermissionPoint): boolean => {
  if (!layer || !targetPoint) {
    return false;
  }

  if (layer.schema && layer.schema.readOnly) {
    return permissions.get(UserPermission.VIEWER).includes(targetPoint);
  }

  const {sourceData} = layer;
  if (!sourceData) {
    return false;
  }

  return permissions.get(sourceData.permission).includes(targetPoint);
};

export const isCreateAllowed = (layer: CrgLayer): boolean => isAllowed(layer, PermissionPoint.CREATE);
export const isReadAllowed   = (layer: CrgLayer): boolean => isAllowed(layer, PermissionPoint.READ);
export const isUpdateAllowed = (layer: CrgLayer): boolean => isAllowed(layer, PermissionPoint.UPDATE);
export const isDeleteAllowed = (layer: CrgLayer): boolean => isAllowed(layer, PermissionPoint.DELETE);
export const isExportAllowed = (layer: CrgLayer): boolean => isAllowed(layer, PermissionPoint.EXPORT);
export const isImportAllowed = (layer: CrgLayer): boolean => isAllowed(layer, PermissionPoint.IMPORT);
