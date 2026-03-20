import { When } from '@wdio/cucumber-framework';

import { libraryDocumentActionsDeleteDialogBlock } from './LibraryDocumentActionsDeleteDialog.block';

When('в диалоговом окне `Подтверждение удаления` я подтверждаю удаление документа', async function () {
  await libraryDocumentActionsDeleteDialogBlock.delete();
});
