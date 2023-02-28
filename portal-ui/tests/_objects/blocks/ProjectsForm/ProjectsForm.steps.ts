import { Then, When } from '@wdio/cucumber-framework';

import { projectForm } from './ProjectsForm.block';

When(/^ввожу в поле ввода названия проекта "(.*)"$/, async (title: string) => {
  await projectForm.setInputValue(title);
});

Then(/^значение поля ввода "(.*)"/, async (title: string) => {
  await projectForm.testInputValue(title);
});

Then(/^фокус находится в текстовом поле формы создания проекта$/, async () => {
  await projectForm.inputIsFocused();
});

Then(/^на форме появляются ошибки$/, async () => {
  await projectForm.waitForErrors();
});

Then(/^на форме отсутствуют ошибки$/, async () => {
  await projectForm.errorsAreEmpty();
});

When(/^нажимаю кнопку `Создать`$/, async () => {
  await projectForm.submit();
});

When(/^нажимаю кнопку `Отмена`$/, async () => {
  await projectForm.cancel();
});
