import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureBlock } from '../EditFeature/EditFeature.block';
import { editFeatureNavigationBlock } from './EditFeatureNavigation.block';

When('в панели редактирования объекта я нажимаю на кнопку `Следующий объект`', async function () {
  await editFeatureNavigationBlock.clickNext();
  await editFeatureBlock.waitForLoading();
});

When('в панели редактирования объекта я нажимаю на кнопку `Предыдущий объект`', async function () {
  await editFeatureNavigationBlock.clickPrev();
  await editFeatureBlock.waitForLoading();
});

Then(
  'в панели редактирования объекта в блоке навигации отображается значение {string}',
  async function (value: string) {
    const fieldValue = await editFeatureNavigationBlock.getValue();

    expect(fieldValue).toEqual(value);
  }
);
