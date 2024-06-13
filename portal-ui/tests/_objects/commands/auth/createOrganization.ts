import { authClient } from '../../../../src/app/services/auth/auth/auth.client';
import { RegData } from '../../../../src/app/services/auth/auth/auth.models';
import { organizationsClient } from '../../../../src/app/services/auth/organizations/organizations.client';
import { requestAs } from '../requestAs';
import { getTestUser } from './testUsers';

export async function createOrganization(regData: RegData): Promise<void> {
  const limit = 60;

  const orgId = await authClient.registration(regData);
  for (let i = 0; i < limit; i++) {
    const organization = await requestAs(
      getTestUser('Администратор системы'),
      organizationsClient.getOrganization,
      orgId
    );

    if (organization.status === 'PROVISIONED') {
      return;
    }

    await browser.pause(2000);
  }

  throw new Error(`Не дождаться создания организации "${regData.company}" за ${limit} секунд`);
}
