import { Then, When } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { libraryDocumentActionsBlock } from '../LibraryDocumentActions/LibraryDocumentActions.block';
import { libraryDocumentActionsCreateChildEditDialogBlock } from './CreateChildEditDialog/LibraryDocumentActions-CreateChildEditDialog.block';
import { libraryDocumentActionsEditDialogBlock } from './EditDialog/LibraryDocumentActions-EditDialog.block';

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

When(
  'в библиотеке документов у созданного документа я нажимаю на кнопку `Переместить`',
  async function (this: ScenarioScope) {
    const explorerBlock = new ExplorerBlock();

    if (this.latestLibraryRecords[0].title) {
      await explorerBlock.selectExplorerItem(this.latestLibraryRecords[0].title);
      await libraryDocumentActionsBlock.clickDocumentMoveBtn();
    } else {
      throw new Error('Что то пошло не так при перемещении документа');
    }
  }
);

When(
  'в библиотеке документов у созданной папки я нажимаю на кнопку `Переместить`',
  async function (this: ScenarioScope) {
    const explorerBlock = new ExplorerBlock();

    if (this.latestFolder.title) {
      await explorerBlock.selectExplorerItem(this.latestFolder.title);
      await libraryDocumentActionsBlock.clickDocumentMoveBtn();
    } else {
      throw new Error('Что то пошло не так при перемещении папки');
    }
  }
);

Then(
  'в библиотеке документов у созданного документа недоступна кнопка `Переместить`',
  async function (this: ScenarioScope) {
    if (this.latestLibraryRecords[0].title) {
      const explorerBlock = new ExplorerBlock();
      await explorerBlock.selectExplorerItem(this.latestLibraryRecords[0].title);
      const exist = await libraryDocumentActionsBlock.documentMoveBtnDisabled();
      await expect(exist).toEqual(false);
    } else {
      throw new Error('Что то пошло не так при перемещении документа');
    }
  }
);

Then('в библиотеке документов у созданной папки недоступна кнопка `Переместить`', async function (this: ScenarioScope) {
  if (this.latestFolder.title) {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.selectExplorerItem(this.latestFolder.title);
    const exist = await libraryDocumentActionsBlock.documentMoveBtnDisabled();
    await expect(exist).toEqual(false);
  } else {
    throw new Error('Что то пошло не так при перемещении папки');
  }
});
