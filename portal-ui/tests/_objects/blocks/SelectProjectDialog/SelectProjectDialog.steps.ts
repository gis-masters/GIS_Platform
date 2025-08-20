import { When } from '@wdio/cucumber-framework';

import { selectProjectDialogBlock } from './SelectProjectDialog.block';

When('в диалоговом окне выбора проекта я выбираю проект {string}', async function (project: string) {
  await selectProjectDialogBlock.selectProject(project);
});

When('в диалоговом окне выбора проекта я выбираю систему координат {string}', async function (crs: string) {
  await selectProjectDialogBlock.selectCrs(crs);
});

When('в диалоговом окне выбора проекта я выбираю нажимаю кнопку `Разместить в выбранном проекте`', async function () {
  await selectProjectDialogBlock.save();
});
