import { When } from '@wdio/cucumber-framework';
import { DataTable } from '@cucumber/cucumber';

import { getTestUser } from '../../../commands/auth/testUsers';
import { usersAddDialogBlock } from './Users-AddDialog.block';

When('в диалоговом окне выбора пользователя я выбираю {string}', async (user: string) => {
  await usersAddDialogBlock.selectUser(user);
});

When('в диалоговом окне выбора пользователя доступны пользователи', async function (data: DataTable) {
  const users = data.raw();

  await Promise.all(users.map(async user => await usersAddDialogBlock.findUser(getTestUser(user[0]).firstName)));
});
