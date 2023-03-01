import { When } from '@wdio/cucumber-framework';

import { workspaceHeaderMenu } from './WorkspaceHeaderMenu.block';

When(/^нажимаю на пункт "(.*)" в главном меню$/, async (itemName: string) => {
  await workspaceHeaderMenu.selectMainMenuOption(itemName);
});
