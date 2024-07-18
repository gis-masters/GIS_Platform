import { Then, When } from '@wdio/cucumber-framework';

import { utilityDialogBlock } from './UtilityDialog.block';

When('в появившемся диалоговом окне подтверждения нажимаю на кнопку {string}', async (title: string) => {
  await utilityDialogBlock.clickButtonByTitle(title);
});

Then('отобразилось диалоговое окно', async () => {
  await utilityDialogBlock.waitForVisible();
});

Then('отобразилось диалоговое окно с текстом {string}', async (content: string) => {
  const result = await utilityDialogBlock.getTextFromDialog();

  await expect(result).toBe(content);
});
