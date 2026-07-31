import { type DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from './EditFeature.block';

When('я нажимаю на стрелку назад в панели просмотра объекта', async function () {
  await editFeatureBlock.goBack();
});

Then('открывается форма просмотра объекта', async function () {
  await editFeatureBlock.waitForVisible({ timeout: 15_000 });
});

Then('не открывается форма просмотра объекта', async function () {
  await editFeatureBlock.waitForHidden();
});

When('в форме просмотра объекта, я перехожу на вкладку просмотра геометрии', async function () {
  await editFeatureBlock.openGeometryTab();
});

When('я дожидаюсь исчезновения индикатора загрузки в форме редактирования объекта', async () => {
  await editFeatureBlock.waitForLoading();
});

When('на панели выделенного объекта я нажимаю `Копировать объект в другой слой`', async function () {
  await editFeatureBlock.copyFeaturesButton.click();
});

When('в форме редактирования объекта я нажимаю кнопку `Сохранить`', async function () {
  await editFeatureBlock.clickSaveButton();
});

When('в форме редактирования объекта я закрываю окно подтверждения сохранения', async function () {
  await editFeatureBlock.closeConfirmDialog();
});

When('в вкладке просмотра геометрии я перевожу курсор на кнопку `Сохранить`', async function () {
  await editFeatureBlock.focusSaveButton();
});

Then('вкладка просмотра геометрии в режиме чтения содержит следующую геометрию', async function (data: DataTable) {
  const expectedGeometry = data
    .raw()
    .flat()
    .filter(item => item.length > 2);

  const geometryAsString = await editFeatureBlock.getGeometryInViewMode();
  const geometry = geometryAsString
    .replaceAll('\n', ' ')
    .replaceAll('\t', ' ')
    .split(' ')
    .filter(item => item.length > 2);

  expect(geometry).toEqual(expectedGeometry);
});

Then('на форме корректно отображаются {string}', async (variant: string) => {
  await editFeatureBlock.assertSelfie(variant.split(' ').join('-'));
});

Then('в панели редактирования объекта отображается форма с полями в {string}', async (variant: string) => {
  await editFeatureBlock.assertSelfie(variant.split(' ').join('-'));
});
