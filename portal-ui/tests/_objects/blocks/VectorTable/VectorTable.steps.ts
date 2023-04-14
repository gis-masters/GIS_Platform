import { Then } from '@wdio/cucumber-framework';

import { explorerBlock } from '../Explorer/Explorer.block';

Then('в списке таблиц существует таблица с названием {string}', async (itemTitle: string) => {
  expect(await explorerBlock.getListTitles()).toContain(itemTitle);
});
