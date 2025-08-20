import { Then, When } from '@wdio/cucumber-framework';

import { projectFormBlock } from './ProjectsForm.block';

When('ввожу в поле ввода названия проекта {string}', async (title: string) => {
  await projectFormBlock.setInputValue(title);
});

Then('значение поля ввода {string}', async (title: string) => {
  await projectFormBlock.testInputValue(title);
});

Then('фокус находится в текстовом поле формы создания проекта', async () => {
  await projectFormBlock.inputIsFocused();
});

Then('на форме появляются ошибки', async () => {
  await projectFormBlock.waitForErrors();
});

Then('на форме отсутствуют ошибки', async () => {
  await projectFormBlock.errorsAreEmpty();
});

When('нажимаю кнопку `Создать`', async () => {
  await projectFormBlock.submit();
});

When('нажимаю кнопку `Отмена`', async () => {
  await projectFormBlock.cancel();
});

Then('блок ProjectsForm вариант {string} выглядит как положено', async (variant: string) => {
  await projectFormBlock.assertSelfie(variant);
});
