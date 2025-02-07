import { When } from '@wdio/cucumber-framework';

import { TestUser } from '../../commands/auth/testUsers';
import { usersAddDialogBlock } from '../Users/AddDialog/Users-AddDialog.block';
import { tasksJournalActionsEditDialogBlock } from './TasksJournalActionsEditDialog.block';

When('я нажимаю кнопку `Сохранить` в диалоговом окне редактирования задачи', async function () {
  await tasksJournalActionsEditDialogBlock.clickSelectSchemaConfirm();
});

When(
  'в диалоговом окне редактирования задачи в форме у обязательного поля {string} с типом user_id я указываю исполнителя {user}',
  async function (field: string, user: TestUser) {
    await tasksJournalActionsEditDialogBlock.clickAddUserBtn(field);
    await usersAddDialogBlock.waitForVisible();
    await usersAddDialogBlock.selectUser(user.firstName);
  }
);
