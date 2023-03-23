import { Then } from '@wdio/cucumber-framework';

import { editFeatureBlock } from './EditFeature.block';

Then(
  /^в панели атрибутов объекта на карте в списке атрибутов отображается только поле "(.*)"$/,
  async (title: string) => {
    await editFeatureBlock.checkObjectAttributeFields(title);
  }
);
