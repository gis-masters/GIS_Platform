import { When } from '@wdio/cucumber-framework';
import { restorePasswordBlock } from './ResorePassword.block';
import { getTestUser, testUsers } from '../../commands/auth/testUsers';

When('я ввожу email пользователя {string} в форму восстановления пароля', async (user: keyof typeof testUsers) => {
  const testUser = getTestUser(user);
  await restorePasswordBlock.fillEmail(testUser.email);
});

When('я нажимаю на кнопку `Запросить новый пароль`', async () => {
  await restorePasswordBlock.submit();
});
