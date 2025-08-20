import { Then } from '@wdio/cucumber-framework';

import { libraryDocumentDialogBlock } from './LibraryDocumentDialog.block';

Then('существует диалоговое окно просмотра созданного документа', async function () {
  await libraryDocumentDialogBlock.waitForVisible();
});
