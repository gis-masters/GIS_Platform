import { Then } from '@wdio/cucumber-framework';

import { ExplorerBlock } from '../Explorer/Explorer.block';

Then('в списке наборов данных существует набор данных с названием {string}', async (itemTitle: string) => {
  const explorerBlock = new ExplorerBlock();
  await expect(await explorerBlock.getListTitles()).toContain(itemTitle);
});
