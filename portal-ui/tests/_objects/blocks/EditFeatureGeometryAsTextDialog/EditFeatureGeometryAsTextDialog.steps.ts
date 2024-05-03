import { When } from '@wdio/cucumber-framework';

import { editFeatureGeometryAsTextDialogBlock } from './EditFeatureGeometryAsTextDialog.block';

When('в форме редактирования объекта на карте заполняю координаты объекта', async () => {
  await editFeatureGeometryAsTextDialogBlock.setObjectDummyCoordinates();
});
