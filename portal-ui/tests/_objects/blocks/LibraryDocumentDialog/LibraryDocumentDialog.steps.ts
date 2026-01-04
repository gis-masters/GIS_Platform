import { Then } from '@wdio/cucumber-framework';

import { libraryDocumentDialogBlock } from './LibraryDocumentDialog.block';

Then('существует диалоговое окно просмотра созданного документа', async function () {
  await libraryDocumentDialogBlock.waitForVisible();
});

Then('открывается окно `Просмотр объекта` с названием объекта {string}', async function (title: string) {
  const currentTitle = await libraryDocumentDialogBlock.getFieldValue('Название');

  expect(title).toEqual(currentTitle);
});
