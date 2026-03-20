import { When } from '@wdio/cucumber-framework';

import { createBufferButtonBlock } from './CreateFeatureBuffer.block';

When('в форме просмотра объекта, я нажимаю кнопку `Создать буфер`', async function () {
  await createBufferButtonBlock.clickCreateBufferBtn();
});
