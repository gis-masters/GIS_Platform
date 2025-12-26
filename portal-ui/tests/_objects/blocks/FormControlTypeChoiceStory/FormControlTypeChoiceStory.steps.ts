import { Then, When } from '@wdio/cucumber-framework';

import { toastBlock } from '../Toast/Toast.block';
import { formControlTypeChoiceStoryBlock } from './FormControlTypeChoiceStory.block';

When(
  'я выбираю значение {string} в поле {string} формы FormControlTypeChoiceStory',
  async (value: string, fieldTitle: string) => {
    await formControlTypeChoiceStoryBlock.setChoiceValue(fieldTitle, value);
  }
);

When(
  'я выбираю значения {strings} в поле {string} формы FormControlTypeChoiceStory',
  async (values: string[], fieldTitle: string) => {
    await formControlTypeChoiceStoryBlock.setChoiceMultipleValues(fieldTitle, values);
  }
);

Then(
  'в поле {string} формы FormControlTypeChoiceStory выбрано значение {string}',
  async (fieldTitle: string, expectedValue: string) => {
    const actualValue = await formControlTypeChoiceStoryBlock.getChoiceValue(fieldTitle);
    await expect(actualValue).toEqual(expectedValue);
  }
);

Then(
  'в поле {string} формы FormControlTypeChoiceStory выбраны значения {strings}',
  async (fieldTitle: string, expectedValues: string[]) => {
    const actualValue = await formControlTypeChoiceStoryBlock.getChoiceValue(fieldTitle);
    await expect(actualValue).toEqual(expectedValues.join('\n'));
  }
);

Then(/значение формы FormControlTypeChoiceStory: (.*)/, async (expectedValue: string) => {
  await formControlTypeChoiceStoryBlock.clickSend();
  await toastBlock.waitForVisible();

  const actualMessage = await toastBlock.getTitle();
  const actualJsonString = actualMessage.replace('Значение формы: ', '');

  // Парсим и сравниваем как объекты, чтобы игнорировать форматирование
  const actualJson: unknown = JSON.parse(actualJsonString);
  const expectedJson: unknown = JSON.parse(expectedValue);

  await expect(actualJson).toEqual(expectedJson);
});
