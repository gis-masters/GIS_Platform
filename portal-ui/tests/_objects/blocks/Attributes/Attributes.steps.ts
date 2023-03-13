import { Then } from '@wdio/cucumber-framework';

import { attributesBlock } from './Attributes.block';

Then(/^в атрибутивной таблице отображается только колонка "(.*)"$/, async (title: string) => {
  await attributesBlock.checkTableSingleColTitle(title);
});

Then(/^открылась атрибутивная таблица слоя "(.*)"$/, async (title: string) => {
  await attributesBlock.checkTableWithTitle(title);
});
