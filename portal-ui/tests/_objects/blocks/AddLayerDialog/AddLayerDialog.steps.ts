import { Then, When } from '@wdio/cucumber-framework';

import { addLayerDialogBlock } from './AddLayerDialog.block';

Then(/^в диалоговом окне `Добавить слой` появляется поле `Представление`$/, async () => {
  await addLayerDialogBlock.checkViewFieldIsAppear();
});

When(/^в диалоговом окне `Добавить слой` не появляется поле `Представление`$/, async () => {
  await addLayerDialogBlock.checkViewFieldIsNotAppear();
});

When(/^в диалоге `Добавить слой` я нажимаю на кнопку `Не выбрано` у поля источник данных$/, async () => {
  await addLayerDialogBlock.selectDatasource();
});
