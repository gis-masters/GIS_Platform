import { When } from '@wdio/cucumber-framework';

import { librarySearchItemActionsBlock } from './LibrarySearchItemActions.block';

When('в панели действий выбранного элемента нажимаю кнопку `Открыть`', async () => {
  await librarySearchItemActionsBlock.clickOpenButton();
});
