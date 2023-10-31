import { When } from '@wdio/cucumber-framework';

import { textOverflowBlock } from './TextOverflow.block';

When('я нажимаю кнопку `Показать всё`', async () => {
  const buttonLabel = await textOverflowBlock.getButtonLabel();
  if (buttonLabel === 'Показать всё') {
    await textOverflowBlock.clickButton();
  } else {
    throw new Error('Отсутствует кнопка `Показать всё`');
  }
});

When('я нажимаю кнопку `Свернуть`', async () => {
  const buttonLabel = await textOverflowBlock.getButtonLabel();
  if (buttonLabel === 'Свернуть') {
    await textOverflowBlock.clickButton();
  } else {
    throw new Error('Отсутствует кнопка `Свернуть`');
  }
});
