import { When } from '@wdio/cucumber-framework';

import { createBufferDialogBlock } from './CreateBufferDialog.block';

When('в окне создания буфера я нажимаю кнопку `Создать`', async function () {
  await createBufferDialogBlock.clickCreateBuffer();
});

When('я жду открытия диалогового окна создания буфера', async function () {
  await createBufferDialogBlock.waitForDialogShow();
});
