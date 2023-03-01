import { When } from '@wdio/cucumber-framework';

import { workspaceHeaderBurger } from './WorkspaceHeaderBurger.block';

When(/^я открываю главное меню$/, async () => {
  await workspaceHeaderBurger.openMainMenu();
});
