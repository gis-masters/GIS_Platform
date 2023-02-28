import { Then } from '@wdio/cucumber-framework';

import { attributes } from './Attributes.block';

Then(/^в атрибутивной таблице отображается только колонка "(.*)"$/, async (title: string) => {
  await attributes.checkTableSingleColTitle(title);
});
