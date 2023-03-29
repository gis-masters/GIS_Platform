import { Given } from '@wdio/cucumber-framework';

import { authenticateAs, authenticateAsOtherAdmin, logout } from './authenticate';
import { createTestUsersInOtherOrganization } from './createUser';
import { getUserByEmail } from './getUserByEmail';
import { getTestUser } from './testUsers';
import { inviteUser } from './inviteUser';

Given('я авторизован как {string}', async (username: string) => {
  await authenticateAs(getTestUser(username));
});

Given('в другой организации существует пользователь {string}', async (username: string) => {
  await authenticateAsOtherAdmin();

  try {
    await getUserByEmail(getTestUser(username).email);
  } catch {
    await createTestUsersInOtherOrganization();
  }

  await logout();
});

Given(
  'пользователь {string} добавлен в организацию под руководством {string}',
  async (username: string, adminName: string) => {
    const user = getTestUser(username);
    const admin = getTestUser(adminName);

    await authenticateAs(admin);
    try {
      if (await getUserByEmail(user.email)) {
        // уже добавлен
        return;
      }
    } catch {}

    await inviteUser(user, admin);
  }
);
