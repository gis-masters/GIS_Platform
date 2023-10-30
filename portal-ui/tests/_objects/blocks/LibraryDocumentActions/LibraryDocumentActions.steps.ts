import { When } from '@wdio/cucumber-framework';

import { libraryDocumentActionsBlock } from '../LibraryDocumentActions/LibraryDocumentActions.block';
import { libraryDocumentActionsEditDialogBlock } from './EditDialog/LibraryDocumentActions-EditDialog.block';
import { libraryDocumentActionsCreateChildEditDialogBlock } from './CreateChildEditDialog/LibraryDocumentActions-CreateChildEditDialog.block';

When(
  'в библиотеке документов в окне редактирования созданного документа я нажимаю кнопку `Удалить набор файлов` в поле {string}',
  async function (field: string) {
    await libraryDocumentActionsBlock.clickEditButton();
    await libraryDocumentActionsEditDialogBlock.clickDeleteFilesInField(field);
  }
);

When(
  'в библиотеке документов в окне редактирования созданного документа я нажимаю кнопку `Сохранить`',
  async function () {
    await libraryDocumentActionsEditDialogBlock.clickSave();
    await libraryDocumentActionsEditDialogBlock.waitForHidden();
  }
);

When('в созданной библиотеке я открываю окно редактирования созданного документа', async function () {
  await libraryDocumentActionsBlock.clickEditButton();
});

When(
  'в созданной библиотеке я открываю окно создания дочернего документа с контент типом {string}',
  async function (contentType: string) {
    await libraryDocumentActionsBlock.clickCreateChildDocButton(contentType);
  }
);

When('в окне редактирования дочернего документа я нажимаю `Отправить`', async function () {
  await libraryDocumentActionsCreateChildEditDialogBlock.clickSave();
});

When('в созданной библиотеке у выбранного документа я нажимаю кнопку `Удалить`', async function () {
  await libraryDocumentActionsBlock.clickDeleteButton();
});
