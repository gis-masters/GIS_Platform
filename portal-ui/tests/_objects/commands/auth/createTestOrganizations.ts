import { addValueToPool, getValueFromPool } from '@wdio/shared-store-service';

import { createTestUsers, createTestUsersInOtherOrganization } from './createTestUsers';
import { createOrganization } from './createOrganization';
import { TestUser, getTestUser } from './testUsers';
import { getUserToken } from './getUserToken';

export async function createTestOrganizations(): Promise<void> {
  let workerFreed = false;
  do {
    try {
      workerFreed = Boolean(await getValueFromPool('creatingOrganizationWorkerFree'));
      await browser.pause(1000);
    } catch {}
  } while (!workerFreed);

  const admin = getTestUser('Администратор организации');
  const otherAdmin = getTestUser('Администратор другой организации');

  await createOrganization(admin);
  await waitForToken(admin);

  await createOrganization(otherAdmin);
  await waitForToken(otherAdmin);

  await createTestUsers();
  await createTestUsersInOtherOrganization();

  await addValueToPool('creatingOrganizationWorkerFree', true);
}

async function waitForToken(user: TestUser): Promise<string> {
  const limit = 60;

  for (let i = 0; i < limit; i++) {
    try {
      return await getUserToken(user);
    } catch {}
    await browser.pause(1000);
  }

  throw new Error(`Не удалось получить токен пользователя "${user.email}" за ${limit} секунд`);
}
