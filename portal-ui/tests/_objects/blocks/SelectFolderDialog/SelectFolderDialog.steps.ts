import { When } from '@wdio/cucumber-framework';

import { selectFolderDialogBlock } from './SelectFolderDialog.block';

When('в окне выбора папки для восстановления документа я нажимаю `Выбрать`', async function () {
  await selectFolderDialogBlock.selectFolder();
});
