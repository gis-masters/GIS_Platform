import { When } from '@wdio/cucumber-framework';

import { libraryDocumentActionsBlock } from '../LibraryDocumentActions/LibraryDocumentActions.block';
import { libraryDocumentActionsEditDialogBlock } from './EditDialog/LibraryDocumentActions-EditDialog.block';

When(
  'в библиотеке документов в окне редактирования созданного документа я нажимаю кнопку `Удалить набор файлов` в поле {string}',
  async function (field: string) {
    await libraryDocumentActionsBlock.clickEdit();
    await libraryDocumentActionsEditDialogBlock.clickDeleteFilesInField(field);
  }
);

When(
  'в библиотеке документов в окне редактирования созданного документа я нажимаю кнопку `Сохранить`',
  async function () {
    await libraryDocumentActionsEditDialogBlock.clickSave();
  }
);
