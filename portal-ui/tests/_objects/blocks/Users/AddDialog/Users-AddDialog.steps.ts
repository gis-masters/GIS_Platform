import { When } from '@wdio/cucumber-framework';

import { usersAddDialogBlock } from './Users-AddDialog.block';

When('в диалоговом окне выбора пользователя я выбираю {string}', async (user: string) => {
  await usersAddDialogBlock.selectUser(user);
});
