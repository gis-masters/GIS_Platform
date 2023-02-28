import { When } from '@wdio/cucumber-framework';

import { editFeatureGeometryAsTextDialog } from './EditFeatureGeometryAsTextDialog.block';

When(/^в форме редактирования объекта на карте заполняю координаты объекта$/, async () => {
  await editFeatureGeometryAsTextDialog.setObjectDummyCoordinates();
});
