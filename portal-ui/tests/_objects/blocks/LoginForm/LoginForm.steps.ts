import { Then, When } from '@wdio/cucumber-framework';

import { getTestUser } from '../../commands/auth/testUsers';
import { loginFormBlock } from './LoginForm.block';

When('я авторизуюсь в форме авторизации как {string}', async (username: string) => {
  const { email, password } = getTestUser(username);
  await loginFormBlock.fillAndSubmit(email, password);
});

When('я ввожу неверные учётные данные в форму входа', async () => {
  await loginFormBlock.fillAndSubmit('snape@email', 'SnapePasss123');
});

Then('на форме входа появляется сообщение об ошибке {string}', async (errorMessage: string) => {
  await loginFormBlock.checkErrorMessage(errorMessage);
});

Then('на форме входа появляется выбор организации', async () => {
  await loginFormBlock.checkOrganizationsListVisibility();
});

When('я нажимаю на пункт {string} в списке организаций в форме авторизации', async (title: string) => {
  await loginFormBlock.clickOrganization(title);
});

Then(/^в списке организаций на форме входа перечислены: (".+"[ ,]*)+$/, async (dirty: string) => {
  const titles = dirty.slice(1, -1).split('", "');
  expect(titles).toEqual(await loginFormBlock.getOrganizations());
});
