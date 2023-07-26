import { When } from '@wdio/cucumber-framework';

import { formControlTypeUrlBlock } from './Control/Form-Control_type_url.block';
import { formControlTypeUserBlock } from './Control/Form-Control_type_user.block';
import { userListDialogBlock } from '../UserListDialog/UserListDialog.block';
import { formControlTypeFileBlock } from './Control/Form-Control_type_file.block';

When('в форме в поле {string} типа url я нажимаю на кнопку добавления нового url', async (title: string) => {
  await formControlTypeUrlBlock.clickAddUrlBtn(title);
});

When('в форме в поле {string} типа url я нажимаю на первую заполненную ссылку', async (title: string) => {
  await formControlTypeUrlBlock.clickFirstUrlLink(title);
});

When('в форме в поле {string} типа user я нажимаю на ссылку `Добавить пользователя`', async (title: string) => {
  await formControlTypeUserBlock.clickAddUserBtn(title);

  await userListDialogBlock.waitForTableContainer();
});

When('в поле файла у прикрепленного файла {string} есть кнопка `Разместить в проекте`', async (title: string) => {
  await expect(await formControlTypeFileBlock.isFilesPlacementBtnExist(title)).toBeTruthy();
});

When('в поле файл у прикрепленного файла {string} нет кнопки `Разместить в проекте`', async (title: string) => {
  await expect(await formControlTypeFileBlock.isFilesPlacementBtnExist(title)).toBeFalsy();
});
