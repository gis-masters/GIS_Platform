import { PrincipalType, type Role, roles } from './permissions.models';

export function isRole(role: unknown): role is Role {
  for (const r of roles) {
    if (r === role) {
      return true;
    }
  }

  return false;
}

export function isPrincipalType(value: unknown): value is PrincipalType {
  return value === PrincipalType.USER || value === PrincipalType.GROUP;
}
