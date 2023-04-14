import { Then } from '@wdio/cucumber-framework';

import { explorerBlock } from '../Explorer/Explorer.block';

Then('в списке наборов данных существует набор данных с названием {string}', async (itemTitle: string) => {
  expect(await explorerBlock.getListTitles()).toContain(itemTitle);
});
