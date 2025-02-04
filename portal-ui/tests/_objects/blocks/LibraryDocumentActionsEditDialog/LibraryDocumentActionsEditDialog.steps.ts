import { Then, When } from '@wdio/cucumber-framework';

import { libraryDocumentActionsEditDialogBlock } from './LibraryDocumentActionsEditDialog.block';

When(
  'в окне редактирования документа я нажимаю `Добавить документ` в поле {string} типа document',
  async (field: string) => {
    await libraryDocumentActionsEditDialogBlock.clickDocumentsAdd(field);
  }
);

Then(
  'в окне редактирования документа в поле {string} типа document выбран только один элемент с названием {string}',
  async (field: string, fieldValue: string) => {
    const fieldValues = await libraryDocumentActionsEditDialogBlock.lookupFieldValues(field);

    await expect(fieldValues).toEqual([fieldValue]);
  }
);
