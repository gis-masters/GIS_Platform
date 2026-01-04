import { When } from '@wdio/cucumber-framework';

import { multipleEditFeatureBlock } from './MultipleEditFeature.block';

When(
  'в панели множественного редактирования объекта я нажимаю кнопку редактирования у поля {string}',
  async function (title: string) {
    await multipleEditFeatureBlock.clickEditInField(title);
  }
);

When(
  'в панели множественного редактирования объекта в поле {string} я заменяю значение на {string}',
  async function (title: string, value: string) {
    await multipleEditFeatureBlock.replaceValueInField(title, value);
  }
);

When('я жду завершения загрузки формы множественного редактирования', async function () {
  await multipleEditFeatureBlock.waitForLoading();
});
