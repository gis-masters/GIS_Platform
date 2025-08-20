import { When } from '@wdio/cucumber-framework';

import { dataManagementBlock } from './DataManagement.block';

When('на странице управления данными доступен пункт меню {string}', async function (menuItem: string) {
  const menuItemExist = await dataManagementBlock.isMenuItemExist(menuItem);

  await expect(menuItemExist).toEqual(true);
});

When('на странице управления данными не доступен пункт меню {string}', async function (menuItem: string) {
  const menuItemExist = await dataManagementBlock.isMenuItemExist(menuItem);

  await expect(menuItemExist).toEqual(false);
});
