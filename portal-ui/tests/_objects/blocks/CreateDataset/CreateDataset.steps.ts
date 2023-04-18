import { Then, When } from '@wdio/cucumber-framework';

import { createDatasetBlock } from './CreateDataset.block';
import { createDatasetFormBlock } from './Form/CreateDataset-Form.block';

Then('мне доступна кнопка `Создать набор данных`', async () => {
  await createDatasetBlock.waitForVisible();
});

When('я, воспользовавшись формой, создаю набор данных {string}', async (datasetTitle: string) => {
  await createDatasetBlock.click();
  await createDatasetFormBlock.waitForVisible();
  await browser.pause(300); // анимация открытия диалогового окна

  await createDatasetFormBlock.setTitleValue(datasetTitle);
  await createDatasetFormBlock.submit();
});
