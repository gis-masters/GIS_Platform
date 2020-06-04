import { CrgLayer } from '../crg/projects.models';
import { schemaService } from '../crg/schema.service';

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
  const { readOnly } = await schemaService.getSchema(layer.schemaId);

  if (!layer || !targetPoint) {
    return false;
  }

  if (readOnly) {
    return permissions.get(UserPermission.VIEWER).includes(targetPoint);
  }

  const { sourceData } = layer;
  if (!sourceData) {
    return false;
  }

  return permissions.get(sourceData.permission).includes(targetPoint);
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
