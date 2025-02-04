import { When } from '@wdio/cucumber-framework';

import { TestUser } from '../../commands/auth/testUsers';
import { usersAddDialogBlock } from '../Users/AddDialog/Users-AddDialog.block';
import { tasksJournalCreateDialogBlock } from './TasksJournalCreateDialog.block';

When(
  'в диалоговом окне создания задачи в форме у обязательного поля {string} с типом user_id я указываю исполнителя {user}',
  async function (field: string, user: TestUser) {
    await tasksJournalCreateDialogBlock.clickAddUserBtn(field);
    await usersAddDialogBlock.waitForVisible();
    await usersAddDialogBlock.selectUser(user.firstName);
  }
);

When(
  'в диалоговом окне создания задачи в форме я нажимаю `Выбрать пользователя` у обязательного поля {string} с типом user_id',
  async function (field: string) {
    await tasksJournalCreateDialogBlock.clickAddUserBtn(field);
    await usersAddDialogBlock.waitForVisible();
  }
);

When('я нажимаю кнопку `Создать` в диалоговом окне создания задачи', async function () {
  await tasksJournalCreateDialogBlock.clickSelectSchemaConfirm();
});
