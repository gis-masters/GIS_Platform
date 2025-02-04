import { Then, When } from '@wdio/cucumber-framework';

import { TestUser } from '../../commands/auth/testUsers';
import { loginFormBlock } from './LoginForm.block';

When('я авторизуюсь в форме авторизации как {user}', async ({ email, password }: TestUser) => {
  await loginFormBlock.waitForVisible();
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

Then('в списке организаций на форме входа перечислены: {strings}', async (titles: string[]) => {
  const organizations = await loginFormBlock.getOrganizations();
  const cleanOrganizations = organizations.map(org => org.replace(/ \d+$/, '')); // remove trailing number
  await expect(titles).toEqual(cleanOrganizations);
});
