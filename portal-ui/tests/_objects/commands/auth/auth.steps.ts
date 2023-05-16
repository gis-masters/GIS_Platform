import { Given } from '@wdio/cucumber-framework';

import { authenticateAs, authenticateAsOtherAdmin, logout } from './authenticate';
import { createTestUsersInOtherOrganization } from './createTestUsers';
import { getUserByEmail } from './getUserByEmail';
import { inviteUser } from './inviteUser';
import { TestUser } from './testUsers';

Given('я авторизован как {user}', async (user: TestUser) => {
  await authenticateAs(user);
});

Given('в другой организации существует пользователь {user}', async (user: TestUser) => {
  await authenticateAsOtherAdmin();

  try {
    await getUserByEmail(user.email);
  } catch {
    await createTestUsersInOtherOrganization();
  }

  await logout();
});

Given('пользователь {user} добавлен в тестовую организацию', async (user: TestUser) => {
  await inviteUser(user);
});
