export interface AuthCredentials {
  username: string;
  password: string;
  orgId?: number;
}

export interface RegData {
  company: string;
  specializationId: number;
  contactPhone: string;
  description?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  password_: string;
  enabled?: boolean;
}

export interface OrganizationsListItemInfo {
  id: number;
  name: string;
}

export interface AuthenticationResult {
  ok: boolean;
  userDisabled?: boolean;
  wrongPassword?: boolean;
  organizations?: OrganizationsListItemInfo[];
}
