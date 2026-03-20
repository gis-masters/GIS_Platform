import { When } from '@wdio/cucumber-framework';

import { selectProjectsTableDialogBlock } from './SelectProjectsTableDialog.block';

When('в табличном окне выбора проекта я выбираю проект {string}', async function (project: string) {
  await selectProjectsTableDialogBlock.selectProject(project);
});
