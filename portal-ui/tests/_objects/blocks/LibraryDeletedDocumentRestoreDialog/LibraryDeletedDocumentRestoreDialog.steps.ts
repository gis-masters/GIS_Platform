import { When } from '@wdio/cucumber-framework';

import { libraryDeletedDocumentRestoreDialogBlock } from './LibraryDeletedDocumentRestoreDialog.block';

When('в окне выбора папки для восстановления документа я нажимаю `Выбрать`', async function () {
  await libraryDeletedDocumentRestoreDialogBlock.selectFolder();
});
