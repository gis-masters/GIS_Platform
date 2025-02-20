import { Then, When } from '@wdio/cucumber-framework';

import { TestUser } from '../../commands/auth/testUsers';
import { ScenarioScope } from '../../ScenarioScope';
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

When(
  'в диалоговом окне редактирования задачи я нажимаю `Выбрать пользователя` у поля {string}',
  async function (field: string) {
    await tasksJournalActionsEditDialogBlock.clickAddUserBtn(field);
  }
);

When(
  'в диалоговом окне редактирования задачи в поле {string} выбираю {string}',
  async (fieldTitle: string, optionTitle: string) => {
    await tasksJournalActionsEditDialogBlock.selectOption(optionTitle, fieldTitle);
  }
);

When(
  'в диалоговом окне редактирования задачи в поле {string} типа `Документ` не заполнено',
  async (fieldTitle: string) => {
    const value = await tasksJournalActionsEditDialogBlock.getDocValue(fieldTitle);

    await expect(value).toEqual([]);
  }
);

Then(
  'в диалоговом окне редактирования созданной задачи отображается ошибка {string}',
  async function (this: ScenarioScope, err: string) {
    const error = await tasksJournalActionsEditDialogBlock.getFromError();

    await expect(error).toEqual(err);
  }
);
