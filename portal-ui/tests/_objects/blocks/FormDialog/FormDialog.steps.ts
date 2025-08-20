import { Then, When } from '@wdio/cucumber-framework';

import { formDialogBlock } from './FormDialog.block';

When('я меняю значение в поле {string} на {string}', async (fieldName: string, fieldValue: string) => {
  await formDialogBlock.changeFieldValueByFieldName(fieldName, fieldValue);
});

When('я нажимаю на кнопку {string}', async (title: string) => {
  await formDialogBlock.clickButtonByTitle(title);
});

Then('FormDialog исчезает', async () => {
  await formDialogBlock.waitForHidden();
});

Then('FormDialog не исчезает', async () => {
  await formDialogBlock.waitForNotHidden();
});
