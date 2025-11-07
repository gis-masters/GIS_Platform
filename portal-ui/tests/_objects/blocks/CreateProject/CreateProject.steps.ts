import { Then, When } from '@wdio/cucumber-framework';

import { createProjectBlock } from './CreateProject.block';

Then('доступна кнопка `создать проект`', async () => {
  await createProjectBlock.waitForCreateProjectVisible();
});

Then('доступна кнопка `создать папку проекта`', async () => {
  await createProjectBlock.waitForCreateProjectFolderVisible();
});

When('я открываю форму создания нового проекта', async () => {
  await createProjectBlock.clickCreateProject();
});

When('я открываю форму создания новой папки проекта', async () => {
  await createProjectBlock.clickCreateProjectFolder();
});
