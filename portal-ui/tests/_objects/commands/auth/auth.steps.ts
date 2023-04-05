import { Given } from '@wdio/cucumber-framework';

import { authenticateAs, authenticateAsOtherAdmin, logout } from './authenticate';
import { createTestUsersInOtherOrganization } from './createTestUsers';
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

Given('пользователь {string} добавлен в тестовую организацию', async (username: string) => {
  await inviteUser(username);
});
