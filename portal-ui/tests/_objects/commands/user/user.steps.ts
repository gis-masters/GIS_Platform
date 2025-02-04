import { Given } from '@wdio/cucumber-framework';

import { getUserByEmail } from '../auth/getUserByEmail';
import { TestUser } from '../auth/testUsers';
import { updateUser } from './updateUser';

Given('у пользователя {user} указан начальник {user}', async function (user: TestUser, boss: TestUser) {
  const userInfo = await getUserByEmail(user.email);
  const bossInfo = await getUserByEmail(boss.email);

  await updateUser(userInfo.id, { bossId: bossInfo.id });
});
