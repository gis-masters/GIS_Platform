import { When } from '@wdio/cucumber-framework';

import { toastStoryButton } from './ToastStoryButton.block';

When(/^я нажимаю кнопку, вызывающую уведомление в библиотеке блоков$/, async () => {
  await toastStoryButton.emitToast();
});
