import { createTestUsers, createTestUsersInOtherOrganization } from './createTestUsers';
import { sleep } from '../../../../src/app/services/util/sleep';
import { createOrganization } from './createOrganization';
import { TestUser, getTestUser } from './testUsers';
import { getUserToken } from './getUserToken';

export async function createTestOrganizations(): Promise<void> {
  const admin = getTestUser('Администратор организации');
  const otherAdmin = getTestUser('Администратор другой организации');

  await sleep(5000 * ((global.testOrganizationIndex || 1) - 1));

  await createOrganization(admin);
  await waitForToken(admin);

  await createOrganization(otherAdmin);
  await waitForToken(otherAdmin);

  await createTestUsers();
  await createTestUsersInOtherOrganization();
}

async function waitForToken(user: TestUser): Promise<string> {
  const limit = 20;

  for (let i = 0; i < limit; i++) {
    try {
      return await getUserToken(user);
    } catch {}
    await browser.pause(1000);
  }

  throw new Error(`Не удалось получить токен пользователя "${user.email}" за ${limit} секунд`);
}
