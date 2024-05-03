import { When } from '@wdio/cucumber-framework';

import { orgAdminBlock } from '../OrgAdmin/OrgAdmin.block';
import { orgUsersBlock } from './OrgUsers.block';

When('в вкладке `Пользователи` я нажимаю кнопку `Создать пользователя`', async function () {
  await orgUsersBlock.clickCreateUserButton();
});

When(
  'в вкладке `Пользователи` у пользователя {string} я нажимаю кнопку `Редактировать`',
  async function (userName: string) {
    await orgAdminBlock.waitForLoadingDisappear();
    await orgUsersBlock.clickEditUserButton(userName);
  }
);

When(
  'в вкладке `Пользователи` в таблице пользователей у пользователя {string} в колонке `Начальник` значение {string}',
  async function (userName: string, bossName: string) {
    const userBoss = await orgUsersBlock.getUserBoss(userName);

    await expect(userBoss).toEqual(bossName);
  }
);

When(
  'в вкладке `Пользователи` в таблице пользователей у пользователя {string} в колонке `Начальник` пусто',
  async function (userName: string) {
    const userBoss = await orgUsersBlock.getUserBoss(userName);

    await expect(userBoss).toEqual('');
  }
);
