import { Given } from '@wdio/cucumber-framework';
import { ScenarioScope } from '../../ScenarioScope';

import { addLayerToGroupByAdmin } from './addLayerToGroupByAdmin';
import { createGroupByAdmin } from './createGroupByAdmin';
import { getCrgLayersGroup } from './getCrgLayersGroup';

Given(
  'в созданном проекте администратором создана отключенная открытая группа {string}',
  async function (this: ScenarioScope, groupTitle: string) {
    const { latestProject } = this;

    const group = getCrgLayersGroup(groupTitle, false, true);

    await createGroupByAdmin(group, latestProject.id);
  }
);

Given(
  'в созданном проекте администратором создана включенная открытая группа {string}',
  async function (this: ScenarioScope, groupTitle: string) {
    const { latestProject } = this;

    const group = getCrgLayersGroup(groupTitle, true, true);

    await createGroupByAdmin(group, latestProject.id);
  }
);

Given(
  'в созданном проекте администратором создана включенная закрытая группа {string}',
  async function (this: ScenarioScope, groupTitle: string) {
    const { latestProject } = this;

    const group = getCrgLayersGroup(groupTitle, true, false);

    await createGroupByAdmin(group, latestProject.id);
  }
);

Given(
  'в проекте {string} в группу {string} добавлен слой {string}',
  async (projectTitle: string, groupTitle: string, layerTitle: string) => {
    await addLayerToGroupByAdmin(projectTitle, groupTitle, layerTitle);
  }
);
