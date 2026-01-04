import { Then, When } from '@wdio/cucumber-framework';

import { selectProjectDialogBlock } from './SelectProjectDialog.block';

When('в диалоговом окне выбора проекта я выбираю {string}', async function (project: string) {
  await selectProjectDialogBlock.selectProject(project);
});

When('в диалоговом окне выбора проекта я выбираю систему координат {string}', async function (crs: string) {
  await selectProjectDialogBlock.selectCrs(crs);
});

Then('в диалоговом окне выбора проекта все элементы недоступны', async function () {
  const allDisabled = await selectProjectDialogBlock.allItemsAreDisabled();

  expect(allDisabled).toBeTruthy();
});
