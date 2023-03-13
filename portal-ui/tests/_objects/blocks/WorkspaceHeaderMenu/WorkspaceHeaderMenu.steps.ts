import { When } from '@wdio/cucumber-framework';

import { workspaceHeaderMenuBlock } from './WorkspaceHeaderMenu.block';

When(/^нажимаю на пункт "(.*)" в главном меню$/, async (itemName: string) => {
  await workspaceHeaderMenuBlock.selectMainMenuOption(itemName);
});
