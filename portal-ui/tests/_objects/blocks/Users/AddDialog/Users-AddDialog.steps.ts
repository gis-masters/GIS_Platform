import { DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';

import { getTestUser } from '../../../commands/auth/testUsers';
import { usersAddDialogBlock } from './Users-AddDialog.block';

When('в диалоговом окне выбора пользователя я выбираю {string}', async (user: string) => {
  await usersAddDialogBlock.selectUser(user);
});

When('в диалоговом окне выбора пользователя я нажимаю кнопку `Выбрать`', async () => {
  await usersAddDialogBlock.save();
});

When('в диалоговом окне выбора пользователя доступны пользователи', async function (data: DataTable) {
  const users = data.raw();

  await Promise.all(users.map(async user => await usersAddDialogBlock.findUser(getTestUser(user[0]).firstName)));
});

When('в диалоговом окне выбора пользователя доступны только пользователи', async function (data: DataTable) {
  const users = data.raw();

  await Promise.all(users.map(async user => await usersAddDialogBlock.findUser(getTestUser(user[0]).firstName)));

  const currentRowsLength = await usersAddDialogBlock.getUsersAmount();

  await expect(users.length).toEqual(currentRowsLength);
});

When(
  'в диалоговом окне выбора пользователя я ввожу в фильтр поля типа string {string} значение {string}',
  async (colTitle: string, filter: string) => {
    await usersAddDialogBlock.setFilter(colTitle, filter);
  }
);

Then('блок UsersAddDialog вариант {string} выглядит как положено', async (variant: string) => {
  await usersAddDialogBlock.assertSelfie(variant);
});

Then(
  'в диалоговом окне выбора пользователя в первой колонке таблицы xTable содержатся только элементы:',
  async ({ rawTable }: { rawTable: string[][] }) => {
    const values = rawTable.flat();

    await expect(values).toEqual(await usersAddDialogBlock.getSecondColValues());
  }
);
