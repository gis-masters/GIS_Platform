import { Given, Then, When } from '@wdio/cucumber-framework';

import { toastBlock } from './Toast.block';

When(/^я нажимаю на псевдоссылку Подробнее\/Скрыть в уведомлении$/, async () => {
  await toastBlock.clickMoar();
});

When('я нажимаю на крестик в уведомлении', async () => {
  await toastBlock.clickClose();
});

Given('произошла искусственная ошибка и присутствует уведомление о ней', async () => {
  await toastBlock.produceError();
});

Then('уведомление исчезает', async () => {
  await toastBlock.waitForHidden();
});

Then('отсутствуют уведомления об ошибках', async () => {
  await toastBlock.notBecomeVisible();
});

Then('появляются подробности уведомления', async () => {
  await toastBlock.waitForDetails();
});

Then('исчезают подробности уведомления', async () => {
  await toastBlock.waitForDetailsHidden();
});

Then('появляется уведомление {string}', async (msg: string) => {
  await toastBlock.waitForVisible();
  await expect(await toastBlock.getTitle()).toEqual(msg);
});

When('я жду появления уведомления {string}', async (msg: string) => {
  await toastBlock.waitForVisible();
  await expect(await toastBlock.getTitle()).toEqual(msg);
});

Then('блок Toast вариант {string} выглядит как положено', async (variant: string) => {
  await toastBlock.assertSelfie(variant);
});
