import { Given, Then, When } from '@wdio/cucumber-framework';

import { toastBlock } from './Toast.block';

When(/^я нажимаю на псевдоссылку Подробнее\/Скрыть в уведомлении$/, async () => {
  await toastBlock.clickMoar();
});

When(/^я нажимаю на крестик в уведомлении$/, async () => {
  await toastBlock.clickClose();
});

Given(/^произошла искусственная ошибка и присутствует уведомление о ней$/, async () => {
  await toastBlock.produceError();
});

Then(/^уведомление исчезает$/, async () => {
  await toastBlock.waitForHidden();
});

Then(/^появляются подробности уведомления$/, async () => {
  await toastBlock.waitForDetails();
});

Then(/^исчезают подробности уведомления$/, async () => {
  await toastBlock.waitForDetailsHidden();
});
