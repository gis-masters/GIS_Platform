import { Given } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { addLayerToGroupAsAdmin } from './addLayerToGroupByAdmin';
import { createGroupAsAdmin } from './createGroupAsAdmin';

Given(
  'в созданном проекте существует отключенная открытая группа {string}',
  async function (this: ScenarioScope, title: string) {
    const { latestProject } = this;
    await createGroupAsAdmin({ title, enabled: false, expanded: true }, latestProject.id);
  }
);

Given(
  'в созданном проекте существует включенная открытая группа {string}',
  async function (this: ScenarioScope, title: string) {
    const { latestProject } = this;
    await createGroupAsAdmin({ title, enabled: true, expanded: true }, latestProject.id);
  }
);

Given(
  'в созданном проекте существует включенная закрытая группа {string}',
  async function (this: ScenarioScope, title: string) {
    const { latestProject } = this;
    await createGroupAsAdmin({ title, enabled: true, expanded: false }, latestProject.id);
  }
);

Given(
  'в проекте {string} в группу {string} добавлен слой {string}',
  async (projectTitle: string, groupTitle: string, layerTitle: string) => {
    await addLayerToGroupAsAdmin(projectTitle, groupTitle, layerTitle);
  }
);
