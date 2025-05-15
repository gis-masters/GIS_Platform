import { Then, When } from '@wdio/cucumber-framework';

import { createProjectFolderBlock } from './CreateProjectFolder.block';
import { createProjectFolderDialogBlock } from './Dialog/CreateProjectFolder-Dialog.block';

Then('доступна кнопка `создать папку проекта`', async () => {
  await createProjectFolderBlock.waitForVisible();
});

When('я открываю форму создания новой папки проекта', async () => {
  await createProjectFolderBlock.click();
});

When(
  'в форме создания новой папки проекта в поле {string} я ввожу значение {string}',
  async (field: string, title: string) => {
    await createProjectFolderDialogBlock.waitForVisible();
    await createProjectFolderDialogBlock.setFieldValue(field, title);
  }
);

When('в форме создания новой папки проекта я нажимаю кнопку `Создать`', async () => {
  await createProjectFolderDialogBlock.submit();
});
