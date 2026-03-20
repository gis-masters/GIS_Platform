import { When } from '@wdio/cucumber-framework';

import { selectFileInLibraryRecordControlDialogBlock } from './SelectFileInLibraryRecordControlDialog.block';

When('в диалоговом окне выбора источника данных `Файл` в проекте нажимаю `Выбрать`', async function () {
  await selectFileInLibraryRecordControlDialogBlock.selectVectorTableBtn();
});
