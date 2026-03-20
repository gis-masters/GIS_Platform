import { When } from '@wdio/cucumber-framework';

import { formStoryActionsBlock } from './FormStoryActions.block';

When('на странице формы в библиотеке блоков я нажимаю кнопку валидации', async () => {
  await formStoryActionsBlock.clickValidate();
});
