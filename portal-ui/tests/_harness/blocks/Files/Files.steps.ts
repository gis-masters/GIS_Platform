import { Then, When } from '@wdio/cucumber-framework';

import { filesBlock } from './Files.block';

When(
  'в библиотеке документов в карточке документа я нажимаю кнопку `разместить в проекте` у файла {string} в поле {string} типа file',
  async function (fileName: string, field: string) {
    await filesBlock.clickPlaceFileBtn(fileName, field);
  }
);

Then('блок FormControlTypeFile вариант {string} выглядит как положено', async (variant: string) => {
  await filesBlock.assertSelfie(variant);
});

When('в поле файла у прикрепленного файла {string} есть кнопка `Разместить в проекте`', async (title: string) => {
  expect(await filesBlock.isFilesPlacementBtnExist(title)).toBeTruthy();
});

When('в поле файл у прикрепленного файла {string} нет кнопки `Разместить в проекте`', async (title: string) => {
  expect(await filesBlock.isFilesPlacementBtnExist(title)).toBeFalsy();
});

When('я нажимаю на кнопку `Разместить в проекте` в поле {string}', async function (title: string) {
  await filesBlock.clickFilesPlacementBtn(title);
});

Then('в поле файл у набора файлов есть единственная кнопка `Удалить набор`', async () => {
  expect(await filesBlock.isCompoundFileHaveSingleDeleteBtn()).toBeTruthy();
});
