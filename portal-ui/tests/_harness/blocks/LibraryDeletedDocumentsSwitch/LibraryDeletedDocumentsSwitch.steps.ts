import { When } from '@wdio/cucumber-framework';

import { libraryDeletedDocumentsSwitchBlock } from './LibraryDeletedDocumentsSwitch.block';

When(
  'на странице табличного представления библиотеки документов я перехожу в корзину удалённых документов',
  async function () {
    await libraryDeletedDocumentsSwitchBlock.deletedDocumentsSwitch();
  }
);
