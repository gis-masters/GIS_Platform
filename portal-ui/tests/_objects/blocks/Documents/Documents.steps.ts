import { Given, When } from '@wdio/cucumber-framework';

import { documentsBlock } from './Documents.block';
import { updateLibraryRecord } from '../../commands/docLibrary/updateLibraryRecord';
import { ScenarioScope } from '../../ScenarioScope';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { documentVersionsWidgetBlock } from '../DocumentVersionsWidget/DocumentVersionsWidget.block';

When(/^я нажимаю на кнопку добавления документа в поле типа `document`$/, async () => {
  await documentsBlock.clickAdd();
});

Given(
  'в созданной библиотеке у созданного документа я изменяю поле {string} на {string}',
  async function (this: ScenarioScope, field: string, value: string) {
    if (this.latestSchema.tableName) {
      await updateLibraryRecord(this.latestSchema.tableName, this.latestLibraryRecords[0].id, {
        [field]: value
      });

      this.latestLibraryRecords[0].title = value;
    }
  }
);

When(
  'в библиотеке документов у созданного документа я нажимаю на кнопку `Версии документа`',
  async function (this: ScenarioScope) {
    const explorerBlock = new ExplorerBlock();
    if (this.latestLibraryRecords[0].title) {
      await explorerBlock.selectExplorerItem(this.latestLibraryRecords[0].title);
      await documentVersionsWidgetBlock.clickDocumentVersionBtn();
    } else {
      throw new Error('Нет документов в библиотеке');
    }
  }
);
