import { ExplorerItemEntityTypeTitle } from '../../components/Explorer/Explorer.models';
import { PermissionsListItemType } from '../../components/PermissionsListDialog/PermissionsListDialog.models';
import {
  ActionTypes,
  DataTypes,
  gisRoles,
  PermissionType,
  PrincipalType,
  Role,
  RoleAssignmentBody,
  roles
} from './permissions.models';

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

export function getRoles(type: PermissionType): Role[] {
  return type === PermissionType.GIS ? gisRoles : roles;
}

export function getAvailableActionsTooltipByRole(action: ActionTypes, role: Role, dataType: DataTypes): string {
  return `${action} недоступно. ${dataType} доступ${dataType === DataTypes.VECTOR_TABLE ? 'на' : 'ен'} вам только для чтения${role === Role.CONTRIBUTOR ? ' и редактирования' : ''}`;
}

export function getRolesByPermissionsListItemType(itemType: PermissionsListItemType): Role[] {
  return itemType === PermissionsListItemType.PROJECT ? gisRoles : roles;
}

export function getRolesByExplorerItemEntityType(entityTypeTitle?: ExplorerItemEntityTypeTitle): Role[] {
  return getRoles(definePermissionType(entityTypeTitle));
}

export function definePermissionType(entityTypeTitle?: ExplorerItemEntityTypeTitle): PermissionType {
  if (!entityTypeTitle) {
    return PermissionType.DATA;
  }

  return entityTypeTitle === ExplorerItemEntityTypeTitle.PROJECT ? PermissionType.GIS : PermissionType.DATA;
}
