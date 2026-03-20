import { Given } from '@wdio/cucumber-framework';

import { getUserByEmail } from '../commands/auth/getUserByEmail';
import { type TestUser } from '../commands/auth/testUsers';
import { updateUser } from '../commands/user/updateUser';

Given('у пользователя {user} указан начальник {user}', async function (user: TestUser, boss: TestUser) {
  const userInfo = await getUserByEmail(user.email);
  const bossInfo = await getUserByEmail(boss.email);

  await updateUser(userInfo.id, { bossId: bossInfo.id });
});
