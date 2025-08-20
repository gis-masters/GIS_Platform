import { When } from '@wdio/cucumber-framework';

import { selectVectorTableControlDialogBlock } from './SelectVectorTableControlDialog.block';

When('в диалоговом окне выбора источника данных в проекте нажимаю `Выбрать`', async () => {
  await selectVectorTableControlDialogBlock.selectVectorTableBtn();
});
