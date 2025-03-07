import { Then, When } from '@wdio/cucumber-framework';

import { ExplorerBlock } from '../../blocks/Explorer/Explorer.block';
import { ScenarioScope } from '../../ScenarioScope';
import { documentEditDialog } from './DocumentEditDialog.block';

When(
  'в окне редактирования документа я пишу {string} в поле {string}',
  async function (value: string, fieldName: string) {
    await documentEditDialog.setStringFieldValue(fieldName, value);
  }
);

When('в окне выбора документа я нажимаю Сохранить', async function () {
  await documentEditDialog.clickSaveButton();
});

Then(
  'в окне редактирования документа в поле {string} отображается ошибка {string}',
  async function (field: string, errorMessage: string) {
    await documentEditDialog.waitForErrorMessage(field, errorMessage);
  }
);

Then('окно редактирования документа закрывается', async function () {
  await documentEditDialog.waitForClose();
});

Then(
  'в списке документов у отредактированного документа отображается имя {string}',
  async function (this: ScenarioScope, expectedName: string) {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();

    if (!this.latestLibraryRecords?.[0]?.id) {
      throw new Error('Нет отредактированного документа');
    }

    await explorerBlock.waitForDocumentTitle(String(this.latestLibraryRecords[0].id), expectedName);
  }
);
