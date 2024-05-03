import { When } from '@wdio/cucumber-framework';

import { TestUser } from '../../commands/auth/testUsers';
import { restorePasswordBlock } from './RestorePassword.block';

When('я ввожу email пользователя {user} в форму восстановления пароля', async (user: TestUser) => {
  await restorePasswordBlock.fillEmail(user.email);
});

When('я нажимаю на кнопку `Запросить новый пароль`', async () => {
  await restorePasswordBlock.submit();
});
