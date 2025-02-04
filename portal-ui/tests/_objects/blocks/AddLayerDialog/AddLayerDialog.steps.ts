import { Then, When } from '@wdio/cucumber-framework';

import { addLayerDialogBlock } from './AddLayerDialog.block';

Then('в диалоговом окне `Добавить слой` появляется поле `Представление`', async function () {
  await addLayerDialogBlock.checkViewFieldIsAppear();
});

When('в диалоговом окне `Добавить слой` не появляется поле `Представление`', async function () {
  await addLayerDialogBlock.checkViewFieldIsNotAppear();
});

When('в диалоговом окне `Добавить слой` я выбираю тип слоя {string}', async function (layerType: string) {
  await addLayerDialogBlock.selectLayerType(layerType);
});

When('в диалоговом окне `Добавить слой` я нажимаю на кнопку `Не выбрано` у поля источник данных', async function () {
  await addLayerDialogBlock.selectDatasource();
});

When('в диалоговом окне `Добавить слой` я нажимаю на кнопку `Не выбрано` у поля документ', async function () {
  await addLayerDialogBlock.selectLibraryRecord();
});

When('в диалоговом окне `Добавить слой` я нажимаю на кнопку `Добавить`', async function () {
  await addLayerDialogBlock.clickAddLayerBtn();
});

When('в диалоговом окне `Добавить слой` я жду окончания загрузки', async function () {
  await addLayerDialogBlock.waitForLoadingDisappear();
});

When('я жду закрытия диалогового окна `Добавить слой`', async function () {
  await addLayerDialogBlock.waitForDialogDisappear();
});

When('я жду открытия диалогового окна `Добавить слой`', async function () {
  await addLayerDialogBlock.waitForDialogExist();
});
