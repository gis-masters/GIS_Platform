import { When } from '@wdio/cucumber-framework';

import { formContentBlock } from '../Form/Content/Form-Content.block';
import { formControlTypeUserBlock } from '../Form/Control/Form-Control_type_user.block';
import { formControlTypeUserIdBlock } from '../Form/Control/Form-Control_type_userId.block';
import { usersAddDialogBlock } from '../Users/AddDialog/Users-AddDialog.block';
import { userCreateEditDialogBlock } from './UserCreateEditDialog.block';

When(
  'в диалоговом окне редактирования пользователя я нажимаю на кнопку `Выбрать пользователя` в поле {string}',
  async (title: string) => {
    await userCreateEditDialogBlock.waitForVisible();

    await formContentBlock.waitForVisible();
    await formControlTypeUserIdBlock.clearSelectedUser(title);
    await formControlTypeUserBlock.clickAddUserBtn(title);

    await usersAddDialogBlock.waitForVisible();
  }
);

When(
  'в диалоговом окне редактирования пользователя я нажимаю на кнопку `Удалить` в поле {string}',
  async (title: string) => {
    await formContentBlock.waitForVisible();
    await formControlTypeUserIdBlock.clickDeleteUserBtn(title);
  }
);

When('я нажимаю кнопку `Обновить` в диалоговом окне редактирования пользователя', async () => {
  await userCreateEditDialogBlock.clickSaveBtn();
});
