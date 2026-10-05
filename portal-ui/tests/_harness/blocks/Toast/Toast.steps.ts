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

Then('не появляется уведомление {string}', async (msg: string) => {
  await toastBlock.assertNoToastWithTitle(msg);
});

Then('появляются подробности уведомления', async () => {
  await toastBlock.waitForDetails();
});

Then('исчезают подробности уведомления', async () => {
  await toastBlock.waitForDetailsHidden();
});

Then('появляется уведомление {string}', async (msg: string) => {
  await toastBlock.waitForVisible();
  expect(await toastBlock.getTitle()).toEqual(msg);
});

Then('появляется уведомление с заголовком {string}', async (msg: string) => {
  await toastBlock.assertToastWithTitle(msg);
});

Then('в подробностях уведомления есть {string}', async (fragment: string) => {
  await toastBlock.assertDetailsContain(fragment);
});

Then(/^не появляется уведомление об ошибке(?: в течение (\d+) мс)?$/, async (timeout?: string) => {
  await toastBlock.assertNoErrorToast(timeout ? Number(timeout) : undefined);
});

When('я жду появления уведомления {string}', async (msg: string) => {
  await toastBlock.waitForVisible();
  expect(await toastBlock.getTitle()).toEqual(msg);
});

Then('блок Toast вариант {string} выглядит как положено', async (variant: string) => {
  await toastBlock.assertSelfie(variant);
});
