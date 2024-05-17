import { Then, When } from '@wdio/cucumber-framework';

import { utilityDialogBlock } from './UtilityDialog.block';

When('в появившемся диалоговом окне подтверждения нажимаю на кнопку {string}', async (title: string) => {
  await utilityDialogBlock.clickButtonByTitle(title);
});

Then('отобразилось диалоговое окно', async () => {
  await utilityDialogBlock.waitForVisible();
});
