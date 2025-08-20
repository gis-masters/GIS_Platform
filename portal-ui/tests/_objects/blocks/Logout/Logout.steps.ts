import { Given, When } from '@wdio/cucumber-framework';

import { logout } from '../../commands/auth/authenticate';

Given('я не авторизован', async () => {
  await logout();
});

When('я выхожу из системы', async () => {
  await logout();
});
