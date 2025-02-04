import { Then, When } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { documentVersionsWidgetBlock } from './DocumentVersionsWidget.block';

Then(
  'в библиотеке документов у созданного документа доступна кнопка `Версии документа`',
  async function (this: ScenarioScope) {
    if (this.latestLibraryRecords[0].title) {
      const explorerBlock = new ExplorerBlock();
      await explorerBlock.selectExplorerItem(this.latestLibraryRecords[0].title);
      const exist = await documentVersionsWidgetBlock.documentVersionBtnExist();
      await expect(exist).toEqual(true);
    } else {
      throw new Error('Нет документов в библиотеке');
    }
  }
);

Then(
  'в библиотеке документов у созданного документа недоступна кнопка `Версии документа`',
  async function (this: ScenarioScope) {
    if (this.latestLibraryRecords[0].title) {
      const explorerBlock = new ExplorerBlock();
      await explorerBlock.selectExplorerItem(this.latestLibraryRecords[0].title);
      const exist = await documentVersionsWidgetBlock.documentVersionBtnExist();
      await expect(exist).toEqual(false);
    } else {
      throw new Error('Нет документов в библиотеке');
    }
  }
);

Then(
  'в диалоговом окне `Восстановление версии документа` у версии документа доступна кнопка `Восстановить версию документа`',
  async function (this: ScenarioScope) {
    const exist = await documentVersionsWidgetBlock.restoreDocumentVersionBtnExist();

    await expect(exist).toEqual(true);
  }
);

Then(
  'в диалоговом окне `Восстановление версии документа` у версии документа недоступна кнопка `Восстановить версию документа`',
  async function (this: ScenarioScope) {
    const exist = await documentVersionsWidgetBlock.restoreDocumentVersionBtnExist();

    await expect(exist).toEqual(false);
  }
);

Then(
  'в диалоговом окне `Восстановление версии документа` существует единственная версия документа с значением {string} у поля {string}',
  async (title: string, fieldName: string) => {
    const oldTitle = await documentVersionsWidgetBlock.getPrevDocumentVersionTitleFieldValue(fieldName);

    await expect(title).toEqual(oldTitle);
  }
);

Then(
  'в библиотеке документов у выбранного документа изменилось {string} на {string}',
  async (fieldName: string, title: string) => {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();
    await explorerBlock.selectExplorerItem(title);
    const oldTitle = await explorerBlock.getContentWidgetFieldValue(fieldName);

    await expect(title).toEqual(oldTitle);
  }
);

Then('в таблице в диалоговом окне `Восстановление версии документа` добавляется новая версия документа', async () => {
  const versions = await documentVersionsWidgetBlock.getDocumentVersionLength();

  await expect(versions).toEqual(2);
});

When(
  'в диалоговом окне `Восстановление версии документа` у единственной предыдущей версии документа я нажимаю кнопку `Восстановить версию документа`',
  async () => {
    await documentVersionsWidgetBlock.isDocumentVersionSingle();
    await documentVersionsWidgetBlock.clickRestoreDocumentVersionBtn();
  }
);

When(
  'в диалоговом окне `Восстановление версии документа` у последней версии документа я нажимаю кнопку `Восстановить версию документа`',
  async () => {
    await documentVersionsWidgetBlock.restoreLastDocumentVersion();
  }
);

When('я закрываю диалоговое окно `Восстановление версии документа`', async () => {
  await documentVersionsWidgetBlock.clickCloseDialogBtn();
});
