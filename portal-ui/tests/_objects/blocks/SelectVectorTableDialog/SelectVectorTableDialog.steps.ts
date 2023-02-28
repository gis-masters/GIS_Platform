import { When } from '@wdio/cucumber-framework';

import { selectVectorTableDialog } from './SelectVectorTableDialog.block';

When(/^в диалоге выбора источника данных в проекте нажимаю `Выбрать`$/, async () => {
  await selectVectorTableDialog.selectVectorTableBtn();
});
