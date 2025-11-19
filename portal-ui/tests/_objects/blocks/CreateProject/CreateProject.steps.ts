import { Then, When } from '@wdio/cucumber-framework';

import { sleep } from '../../../../src/app/services/util/sleep';
import { createProjectBlock } from './CreateProject.block';

Then('доступна кнопка `создать проект`', async () => {
  await createProjectBlock.waitForCreateProjectVisible();
});

Then('доступна кнопка `создать папку проекта`', async () => {
  await createProjectBlock.waitForCreateProjectFolderVisible();
});

When('я открываю форму создания нового проекта', async () => {
  await createProjectBlock.clickCreateProject();
  await sleep(500); // Ждем "Область показа"
});

When('я открываю форму создания новой папки проекта', async () => {
  await createProjectBlock.clickCreateProjectFolder();
});
