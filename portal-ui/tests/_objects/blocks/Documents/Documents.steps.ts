import { When } from '@wdio/cucumber-framework';

import { documentsBlock } from './Documents.block';

When(/^я нажимаю на кнопку добавления документа в поле типа `document`$/, async () => {
  await documentsBlock.clickAdd();
});
