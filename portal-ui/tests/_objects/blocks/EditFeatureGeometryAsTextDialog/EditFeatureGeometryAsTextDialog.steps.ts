import { DataTable, Then, When } from '@wdio/cucumber-framework';

import { editFeatureGeometryAsTextDialogBlock } from './EditFeatureGeometryAsTextDialog.block';

When('в форме редактирования объекта на карте заполняю координаты объекта', async () => {
  await editFeatureGeometryAsTextDialogBlock.setObjectDummyCoordinates();
});

Then('объект содержит следующую геометрию', async function (data: DataTable) {
  const expectedGeometry = data
    .raw()
    .flat()
    .filter(item => item.length > 2);

  const geometryAsString = await editFeatureGeometryAsTextDialogBlock.getObjectCoordinates();
  const geometry = geometryAsString
    .replaceAll('\n', ' ')
    .replaceAll('\t', ' ')
    .split(' ')
    .filter(item => item.length > 2);

  await expect(geometry).toEqual(expectedGeometry);
});
