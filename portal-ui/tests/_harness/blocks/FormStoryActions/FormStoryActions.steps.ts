import { When } from '@wdio/cucumber-framework';

import { formStoryActionsBlock } from './FormStoryActions.block';

When('на странице формы в библиотеке блоков я нажимаю кнопку валидации', async () => {
  await formStoryActionsBlock.clickValidate();
});

When('на странице формы в библиотеке блоков я нажимаю кнопку очистки', async () => {
  await formStoryActionsBlock.clickClear();
});

When('на странице формы в библиотеке блоков я нажимаю кнопку заполнения валидными данными', async () => {
  await formStoryActionsBlock.clickSetValidData();
});

When('на странице формы в библиотеке блоков я нажимаю кнопку заполнения невалидными данными', async () => {
  await formStoryActionsBlock.clickSetErrorData();
});
