import { requestAsAdmin } from '../requestAs';

import { organizationsClient } from '../../../../src/app/services/auth/organizations/organizations.client';
import { OrgSettings } from '../../../../src/app/stores/OrganizationSettings.store';

export async function setOrgSetting(payload: OrgSettings): Promise<void> {
  await requestAsAdmin(organizationsClient.setOrganizationSettings, payload);
}
