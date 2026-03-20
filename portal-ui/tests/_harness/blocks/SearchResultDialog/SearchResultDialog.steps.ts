import { When } from '@wdio/cucumber-framework';

import { searchResultDialogBlock } from './SearchResultDialog.block';

When('в окне результатов поиска я выбираю элемент {string}', async (title: string) => {
  await searchResultDialogBlock.selectItem(title);
});
