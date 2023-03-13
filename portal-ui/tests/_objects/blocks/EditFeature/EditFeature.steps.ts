import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from './EditFeature.block';

When(/^в форме редактирования объекта на карте нажимаю `Сохранить`$/, async () => {
  await editFeatureBlock.saveNewObject();
});

Then(
  /^в форме редактирования объекта на карте в списке атрибутов отображается только поле "(.*)"$/,
  async (title: string) => {
    await editFeatureBlock.checkObjectAttributeFields(title);
  }
);
