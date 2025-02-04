import { When } from '@wdio/cucumber-framework';

import { workspaceHeaderBurgerBlock } from './WorkspaceHeaderBurger.block';

When(/^я открываю главное меню$/, async () => {
  await workspaceHeaderBurgerBlock.openMainMenu();
});
