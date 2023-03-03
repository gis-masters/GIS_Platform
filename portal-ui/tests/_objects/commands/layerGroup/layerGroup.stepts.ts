import { Given } from '@wdio/cucumber-framework';

import { addLayerToGroupByAdmin } from './addLayerToGroupByAdmin';
import { createNewGroupByAdmin } from './createNewGroupByAdmin';

Given(
  /^в проекте "(.*)" существует отключенная группа "(.*)" созданная администратором$/,
  async (projectTitle: string, groupTitle: string) => {
    await createNewGroupByAdmin(projectTitle, groupTitle, false);
  }
);

Given(
  /^в проекте "(.*)" существует включенная группа "(.*)" созданная администратором$/,
  async (projectTitle: string, groupTitle: string) => {
    await createNewGroupByAdmin(projectTitle, groupTitle, true);
  }
);

Given(
  /^в проекте "(.*)" в группу "(.*)" добавлен слой "(.*)"$/,
  async (projectTitle: string, groupTitle: string, layerTitle: string) => {
    await addLayerToGroupByAdmin(projectTitle, groupTitle, layerTitle);
  }
);
