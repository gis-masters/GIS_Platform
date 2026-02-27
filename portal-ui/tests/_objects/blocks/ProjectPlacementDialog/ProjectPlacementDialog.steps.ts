import { When } from '@wdio/cucumber-framework';

import { type ScenarioScope } from '../../ScenarioScope';
import { projectPlacementDialogBlock } from './ProjectPlacementDialog.block';

When('в диалоговом окне `Выбор проекта` нажимаю `Разместить в выбранном проекте`', async () => {
  await projectPlacementDialogBlock.projectSelectDialogAcceptBtn();
});

When('в диалоговом окне `Выбор проекта` выбираю текущий проект', async function (this: ScenarioScope) {
  const project = this.latestProject;

  await projectPlacementDialogBlock.selectRowItem(project.name);
});
