import { When } from '@wdio/cucumber-framework';

import { logout } from '../../commands/auth/authenticate';

When('я выхожу из системы', async () => {
  await logout();
});
