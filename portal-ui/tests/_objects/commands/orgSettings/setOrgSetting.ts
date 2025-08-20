import { organizationsClient } from '../../../../src/app/services/auth/organizations/organizations.client';
import { CompositeSettings } from '../../../../src/app/stores/OrganizationSettings.store';
import { getTestUser, TestUser } from '../auth/testUsers';
import { requestAs, requestAsSuperAdmin } from '../requestAs';

export async function setOrgSetting(payload: CompositeSettings): Promise<void> {
  await requestAs(getTestUser('Администратор организации'), organizationsClient.setOrganizationSettings, payload);
}

export async function setOrgSettingAsSuperAdmin(payload: CompositeSettings): Promise<void> {
  await requestAsSuperAdmin(organizationsClient.setOrganizationSettings, payload);
}

export async function getOrgSettingAsSuperAdmin(user: TestUser): Promise<CompositeSettings | undefined> {
  const organizationsSettings = await requestAsSuperAdmin(organizationsClient.getOrganizationSettings);

  return (organizationsSettings as unknown as CompositeSettings[]).find(({ name }) => name === user.company);
}
