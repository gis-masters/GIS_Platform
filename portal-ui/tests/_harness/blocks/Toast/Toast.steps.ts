import { Given, Then, When } from '@wdio/cucumber-framework';

import { toastBlock } from './Toast.block';

When(/^я нажимаю на псевдоссылку Подробнее\/Скрыть в уведомлении$/, async () => {
  await toastBlock.clickMoar();
});

When('я навожусь на иконку типа слоя в подробностях уведомления', async () => {
  await toastBlock.hoverDetailsTypeIcon();
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
  await toastBlock.waitForTitle(msg);
});

Then(/^в уведомлении (есть лоадер|нет лоадера)$/, async (presence: string) => {
  await toastBlock.assertPart('loader', presence === 'есть лоадер');
});

Then(/^в уведомлении (есть крестик|нет крестика)$/, async (presence: string) => {
  await toastBlock.assertPart('close', presence === 'есть крестик');
});

Then(/^в уведомлении (есть иконка типа|нет иконки типа)$/, async (presence: string) => {
  await toastBlock.assertPart('icon', presence === 'есть иконка типа');
});

Then('отображается одно уведомление', async () => {
  expect(await toastBlock.getCount()).toBe(1);
});

Then('уведомление не исчезает за короткое время', async () => {
  await toastBlock.assertStillVisible();
});

Then('блок Toast вариант {string} выглядит как положено', async (variant: string) => {
  await toastBlock.assertSelfie(variant);
});
