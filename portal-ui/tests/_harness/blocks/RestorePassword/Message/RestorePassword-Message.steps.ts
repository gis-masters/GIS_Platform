import { Then } from '@wdio/cucumber-framework';

import { restorePasswordMessageBlock } from './RestorePassword-Message.block';

Then('диалоговое окно с сообщением о сбросе пароля отобразилось', async () => {
  await restorePasswordMessageBlock.waitForVisible();
});
