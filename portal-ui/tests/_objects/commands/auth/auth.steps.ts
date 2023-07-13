import { Given } from '@wdio/cucumber-framework';

import { authenticateAs } from './authenticate';
import { TestUser, getTestUser } from './testUsers';
import { getUserByEmail } from './getUserByEmail';
import { inviteUser } from './inviteUser';

Given('я авторизован как {user}', async (user: TestUser) => {
  await authenticateAs(user);
});

Given('в другой организации существует пользователь {user}', async (user: TestUser) => {
  await getUserByEmail(user.email, getTestUser('Администратор другой организации'));
});

Given('пользователь {user} добавлен в тестовую организацию', async (user: TestUser) => {
  await inviteUser(user);
});
