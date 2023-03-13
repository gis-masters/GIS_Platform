import { Then, When } from '@wdio/cucumber-framework';

import { testUsers } from '../../commands/auth/testUsers';
import { loginFormBlock } from './LoginForm.block';

When(/^я авторизуюсь в форме авторизации как "(.*)"$/, async (user: keyof typeof testUsers) => {
  const { email, password } = testUsers[user];
  await loginFormBlock.fillAndSubmit(email, password);
});

When(/^я ввожу неправильные данные в форму входа$/, async () => {
  await loginFormBlock.fillAndSubmit('snape@email', 'SnapePasss123');
});

Then(/^на форме входа появляется сообщение об ошибке "(.*)"$/, async (errorMessage: string) => {
  await loginFormBlock.checkErrorMessage(errorMessage);
});

Then(/^на форме входа появляется выбор организации$/, async () => {
  await loginFormBlock.checkOrganizationsListVisibility();
});

When(/^я нажимаю на пункт "(.*)" в списке организаций в форме авторизации$/, async (title: string) => {
  await loginFormBlock.clickOrganization(title);
});

Then(/^в списке организаций на форме входа перечислены: (".+"[ ,]*)+$/, async (dirty: string) => {
  const titles = dirty.slice(1, -1).split('", "');
  expect(titles).toEqual(await loginFormBlock.getOrganizations());
});
