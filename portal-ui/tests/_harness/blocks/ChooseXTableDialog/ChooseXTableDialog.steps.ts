import { Then, When } from '@wdio/cucumber-framework';

import { isArray } from '../../../../src/app/services/util/typeGuards/isArray';
import { isRecordStringUnknown } from '../../../../src/app/services/util/typeGuards/isRecordStringUnknown';
import { toastBlock } from '../Toast/Toast.block';
import { chooseXTableDialogBlock } from './ChooseXTableDialog.block';

When('в диалоге выбора я нажимаю Выбрать', async () => {
  await chooseXTableDialogBlock.waitForVisible();
  await chooseXTableDialogBlock.clickSubmitButton();
});

When('в диалоге выбора я нажимаю {string}', async (title: string) => {
  await chooseXTableDialogBlock.waitForVisible();
  await chooseXTableDialogBlock.clickActionByTitle(title);
});

Then('в диалоге выбора кнопка Выбрать доступна', async () => {
  await chooseXTableDialogBlock.waitForVisible();
  expect(await chooseXTableDialogBlock.isSubmitEnabled()).toBe(true);
});

Then('в диалоге выбора кнопка Выбрать недоступна', async () => {
  await chooseXTableDialogBlock.waitForVisible();
  expect(await chooseXTableDialogBlock.isSubmitEnabled()).toBe(false);
});

Then('в диалоге выбора вторая кнопка называется {string}', async (expectedTitle: string) => {
  await chooseXTableDialogBlock.waitForVisible();
  expect(await chooseXTableDialogBlock.getSecondActionText()).toBe(expectedTitle);
});

Then(/^результат выбора: (.*)$/, async (expectedValue: string) => {
  await toastBlock.waitForVisible();

  const actualJson: unknown = JSON.parse(await toastBlock.getTitle());
  const expectedJson: unknown = JSON.parse(expectedValue);

  expect(actualJson).toEqual(expectedJson);
});

Then('результат выбора содержит {int} элементов', async (expectedCount: number) => {
  expect(await getSelectionToastItems()).toHaveLength(expectedCount);
});

Then('результат выбора содержит id {int}', async (id: number) => {
  expect(await getSelectionToastIds()).toContain(id);
});

Then('результат выбора не содержит id {int}', async (id: number) => {
  expect(await getSelectionToastIds()).not.toContain(id);
});

async function getSelectionToastItems(): Promise<unknown[]> {
  await toastBlock.waitForVisible();

  const actualJson: unknown = JSON.parse(await toastBlock.getTitle());
  if (!isArray(actualJson)) {
    throw new TypeError(`Ожидался массив в результате выбора, получено: ${typeof actualJson}`);
  }

  return actualJson;
}

async function getSelectionToastIds(): Promise<number[]> {
  const items = await getSelectionToastItems();

  return items.map(item => {
    if (!isRecordStringUnknown(item) || typeof item.id !== 'number') {
      throw new TypeError('В результате выбора у элемента нет числового id');
    }

    return item.id;
  });
}
