import { When } from '@wdio/cucumber-framework';

import { formControlTypeUserIdBlock } from '../Form/Control/Form-Control_type_userId.block';
import { formControlTypeUserBlock } from '../Form/Control/Form-Control_type_user.block';
import { userCreateEditDialogBlock } from './UserCreateEditDialog.block';
import { formContentBlock } from '../Form/Form-Content.block';

When(
  'в диалоговом окне редактирования пользователя я нажимаю на кнопку `Выбрать пользователя` в поле {string}',
  async (title: string) => {
    await userCreateEditDialogBlock.waitForVisible();

    await formContentBlock.waitForVisible();
    await formControlTypeUserIdBlock.clearSelectedUser(title);
    await formControlTypeUserBlock.clickAddUserBtn(title);
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
