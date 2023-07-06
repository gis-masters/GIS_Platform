import { When } from '@wdio/cucumber-framework';

import { restorePasswordBlock } from './RestorePassword.block';
import { TestUser } from '../../commands/auth/testUsers';

When('я ввожу email пользователя {user} в форму восстановления пароля', async (user: TestUser) => {
  await restorePasswordBlock.fillEmail(user.email);
});

When('я нажимаю на кнопку `Запросить новый пароль`', async () => {
  await restorePasswordBlock.submit();
});
