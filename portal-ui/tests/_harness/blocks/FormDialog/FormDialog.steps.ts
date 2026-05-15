import { Then, When } from '@wdio/cucumber-framework';

import { formDialogBlock } from './FormDialog.block';

When(
  'в диалоговом окне формы в текстовом поле {string} я меняю значение на {string}',
  async (fieldName: string, fieldValue: string) => {
    await formDialogBlock.setStringValue(fieldName, fieldValue);
  }
);

When(
  'в диалоговом окне формы в поле файла {string} я указываю тестовый файл {string}',
  async (fieldLabel: string, fileName: string) => {
    await formDialogBlock.setFileFromTestFiles(fieldLabel, fileName);
  }
);

When('в диалоговом окне формы я нажимаю на кнопку {string}', async (title: string) => {
  await formDialogBlock.clickActionButton(title);
});

Then('FormDialog исчезает', async () => {
  await formDialogBlock.waitForHidden();
});

Then('FormDialog не исчезает', async () => {
  await formDialogBlock.waitForNotHidden();
});

Then(
  'в диалоговом окне формы текстовое поле {string} имеет значение {string}',
  async (fieldName: string, fieldValue: string) => {
    const value = await formDialogBlock.getStringValue(fieldName);
    expect(value).toBe(fieldValue);
  }
);
