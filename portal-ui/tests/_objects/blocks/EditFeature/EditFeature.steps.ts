import { Then, When } from '@wdio/cucumber-framework';

import { editFeature } from './EditFeature.block';

When(/^в форме редактирования объекта на карте нажимаю `Сохранить`$/, async () => {
  await editFeature.saveNewObject();
});

Then(
  /^в форме редактирования объекта на карте в списке атрибутов отображается только поле "(.*)"$/,
  async (title: string) => {
    await editFeature.checkObjectAttributeFields(title);
  }
);
