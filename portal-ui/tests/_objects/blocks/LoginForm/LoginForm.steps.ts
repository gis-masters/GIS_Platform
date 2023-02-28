import { Then, When } from '@wdio/cucumber-framework';

import { testUsers } from '../../commands/auth/testUsers';
import { loginForm } from './LoginForm.block';

When(/^я авторизуюсь в форме авторизации как "(.*)"$/, async (user: keyof typeof testUsers) => {
  const { email, password } = testUsers[user];
  await loginForm.fillAndSubmit(email, password);
});

When(/^я ввожу неправильные данные в форму входа$/, async () => {
  await loginForm.fillAndSubmit('snape@email', 'SnapePasss123');
});

Then(/^на форме входа появляется сообщение об ошибке "(.*)"$/, async (errorMessage: string) => {
  await loginForm.checkErrorMessage(errorMessage);
});

Then(/^на форме входа появляется выбор организации$/, async () => {
  await loginForm.checkOrganizationsListVisibility();
});

When(/^я нажимаю на пункт "(.*)" в списке организаций в форме авторизации$/, async (title: string) => {
  await loginForm.clickOrganization(title);
});

Then(/^в списке организаций на форме входа перечислены: (".+"[ ,]*)+$/, async (dirty: string) => {
  const titles = dirty.slice(1, -1).split('", "');
  expect(titles).toEqual(await loginForm.getOrganizations());
});
