import { When } from '@wdio/cucumber-framework';

import { formControlTypeUrlBlock } from './Control/Form-Control_type_url.block';
import { formControlTypeUserBlock } from './Control/Form-Control_type_user.block';
import { userListDialogBlock } from '../UserListDialog/UserListDialog.block';

When('в форме в поле {string} типа url я нажимаю на кнопку добавления нового url', async (title: string) => {
  await formControlTypeUrlBlock.clickAddUrlBtn(title);
});

When('в форме в поле {string} типа url я нажимаю на первую заполненную ссылку', async (title: string) => {
  await formControlTypeUrlBlock.clickFirstUrlLink(title);
});

When('в форме в поле {string} типа user я нажимаю на ссылку `Добавить пользователя`', async (title: string) => {
  await formControlTypeUserBlock.clickAddUserBtn(title);

  await userListDialogBlock.waitForVisible();
});
