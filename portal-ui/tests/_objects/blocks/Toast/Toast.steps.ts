import { Given, Then, When } from '@wdio/cucumber-framework';

import { toast } from './Toast.block';

When(/^я нажимаю на псевдоссылку Подробнее\/Скрыть в уведомлении$/, async () => {
  await toast.clickMoar();
});

When(/^я нажимаю на крестик в уведомлении$/, async () => {
  await toast.clickClose();
});

Given(/^произошла искусственная ошибка и присутствует уведомление о ней$/, async () => {
  await toast.produceError();
});

Then(/^уведомление исчезает$/, async () => {
  await toast.waitForHidden();
});

Then(/^появляются подробности уведомления$/, async () => {
  await toast.waitForDetails();
});

Then(/^исчезают подробности уведомления$/, async () => {
  await toast.waitForDetailsHidden();
});
