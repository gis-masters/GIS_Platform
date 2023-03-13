import { When } from '@wdio/cucumber-framework';

import { selectVectorTableDialogBlock } from './SelectVectorTableDialog.block';

When(/^в диалоге выбора источника данных в проекте нажимаю `Выбрать`$/, async () => {
  await selectVectorTableDialogBlock.selectVectorTableBtn();
});
