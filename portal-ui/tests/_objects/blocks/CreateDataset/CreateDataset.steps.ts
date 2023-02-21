import { Then, When } from '@wdio/cucumber-framework';

import { createDataset } from './CreateDataset.block';
import { createDatasetForm } from './Form/CreateDataset-Form.block';

Then(/^мне доступна кнопка `Создать набор данных`$/, async () => {
  await createDataset.waitForVisible();
});

When(/^я, воспользовавшись формой, создаю набор данных "([^"]*)"$/, async (datasetTitle: string) => {
  await createDataset.click();
  await createDatasetForm.waitForVisible();
  await browser.pause(300); // анимация открытия диалогового окна

  await createDatasetForm.setTitleValue(datasetTitle);
  await createDatasetForm.submit();
});
