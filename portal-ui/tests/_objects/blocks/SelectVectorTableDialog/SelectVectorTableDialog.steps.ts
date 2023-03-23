import { When } from '@wdio/cucumber-framework';

import { selectVectorTableDialogBlock } from './SelectVectorTableDialog.block';

When(/^в диалоговом окне выбора источника данных в проекте нажимаю `Выбрать`$/, async () => {
  await selectVectorTableDialogBlock.selectVectorTableBtn();
});
