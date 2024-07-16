import { organizationsClient } from '../../../../src/app/services/auth/organizations/organizations.client';
import { CompositeSettings } from '../../../../src/app/stores/OrganizationSettings.store';
import { requestAsAdmin } from '../requestAs';

export async function setOrgSetting(payload: CompositeSettings): Promise<void> {
  await requestAsAdmin(organizationsClient.setOrganizationSettings, payload);
}
