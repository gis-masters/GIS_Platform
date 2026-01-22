import { type ActionTypes, DataTypes, type PrincipalType, Role, type RoleAssignmentBody } from './permissions.models';

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

export function getAvailableActionsTooltipByRole(action: ActionTypes, role: Role, dataType: DataTypes): string {
  return `${action} недоступно. ${dataType} доступ${dataType === DataTypes.VECTOR_TABLE ? 'на' : 'ен'} вам только для чтения${role === Role.CONTRIBUTOR ? ' и редактирования' : ''}`;
}
