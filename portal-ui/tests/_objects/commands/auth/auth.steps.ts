import { Given } from '@wdio/cucumber-framework';

import { authenticateAs } from './authenticate';
import { editUser } from './editUser';
import { getUserByEmail } from './getUserByEmail';
import { inviteUser } from './inviteUser';
import { getTestUser, TestUser } from './testUsers';

Given('я авторизован как {user}', async (user: TestUser) => {
  await authenticateAs(user);
});

Given('в другой организации существует пользователь {user}', async (user: TestUser) => {
  await getUserByEmail(user.email, getTestUser('Администратор другой организации'));
});

Given('пользователь {user} добавлен в тестовую организацию', async (user: TestUser) => {
  await inviteUser(user);
});

Given('у пользователя {user} назначен подчиненный {user}', async (boss: TestUser, user: TestUser) => {
  const bossUser = await getUserByEmail(boss.email);
  const subordinate = await getUserByEmail(user.email);

  await editUser({ bossId: bossUser.id }, subordinate.id);
});
