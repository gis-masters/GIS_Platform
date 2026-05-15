import { When } from '@wdio/cucumber-framework';

import { schemaActionsBlock } from './SchemaActions.block';

When('я открываю окно редактирования схемы данных', async () => {
  await schemaActionsBlock.clickEditBtn();
});
