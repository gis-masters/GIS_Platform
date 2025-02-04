import { Then, When } from '@wdio/cucumber-framework';

import { createProjectBlock } from './CreateProject.block';
import { createProjectDialogBlock } from './Dialog/CreateProject-Dialog.block';

Then('доступна кнопка `создать проект`', async () => {
  await createProjectBlock.waitForVisible();
});

When('я открываю форму создания нового проекта', async () => {
  await createProjectBlock.click();
});

When(
  'в форме создания нового проекта в поле {string} я ввожу значение {string}',
  async (field: string, title: string) => {
    await createProjectDialogBlock.waitForVisible();
    await createProjectDialogBlock.setFieldValue(field, title);
  }
);

When('в форме создания нового проекта я нажимаю кнопку `Создать`', async () => {
  await createProjectDialogBlock.submit();
});
