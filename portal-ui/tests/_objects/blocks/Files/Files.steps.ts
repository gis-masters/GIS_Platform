import { When } from '@wdio/cucumber-framework';

import { filesBlock } from './Files.block';

When(
  'в библиотеке документов в карточке документа я нажимаю кнопку `разместить в проекте` у файла {string} в поле {string} типа file',
  async function (fileName: string, field: string) {
    await filesBlock.clickPlaceFileBtn(fileName, field);
  }
);
