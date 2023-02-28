import { Then, When } from '@wdio/cucumber-framework';

import { addLayerDialog } from './AddLayerDialog.block';

Then(/^в диалоговом окне `Добавить слой` появляется поле `Представление`$/, async () => {
  await addLayerDialog.checkViewFieldIsAppear();
});

When(/^в диалоговом окне `Добавить слой` не появляется поле `Представление`$/, async () => {
  await addLayerDialog.checkViewFieldIsNotAppear();
});

When(/^в диалоге `Добавить слой` я нажимаю на кнопку `Не выбрано` у поля источник данных$/, async () => {
  await addLayerDialog.selectDatasource();
});
