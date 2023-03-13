import { When } from '@wdio/cucumber-framework';

import { toastStoryButtonBlock } from './ToastStoryButton.block';

When(/^я нажимаю кнопку, вызывающую уведомление в библиотеке блоков$/, async () => {
  await toastStoryButtonBlock.emitToast();
});
