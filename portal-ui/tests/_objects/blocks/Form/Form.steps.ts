import { Then, When } from '@wdio/cucumber-framework';

import { usersAddDialogBlock } from '../Users/AddDialog/Users-AddDialog.block';
import { formControlTypeUrlBlock } from './Control/Form-Control_type_url.block';
import { formControlTypeUserBlock } from './Control/Form-Control_type_user.block';
import { formControlTypeFileBlock } from './Control/Form-Control_type_file.block';
import { formControlTypeChoiceBlock } from './Control/Form-Control_type_choice.block';
import { formControlTypeStringBlock } from './Control/Form-Control_type_string.block';
import { formControlTypeDocumentBlock } from './Control/Form-Control_type_document.block';
import { formViewTypeDocumentBlock } from './View/Form-View_type_document.block';
import { formViewTypeChoiceBlock } from './View/Form-View_type_choice.block';
import { formViewTypeStringBlock } from './View/Form-View_type_string.block';
import { formViewTypeUserBlock } from './View/Form-View_type_user.block';
import { formContentBlock } from './Form-Content.block';
import { formViewTypeFileBlock } from './View/Form-View_type_file.block';

When('в форме в поле {string} типа url я нажимаю на кнопку добавления нового url', async (title: string) => {
  await formControlTypeUrlBlock.clickAddUrlBtn(title);
});

When('в форме в поле {string} типа url я нажимаю на первую заполненную ссылку', async (title: string) => {
  await formControlTypeUrlBlock.clickFirstUrlLink(title);
});

When('в форме в поле {string} типа user я нажимаю на кнопку `Добавить пользователя`', async (title: string) => {
  await formControlTypeUserBlock.clickAddUserBtn(title);

  await usersAddDialogBlock.waitForVisible();
  await usersAddDialogBlock.xTable.waitForLoading();
});

When('в поле файла у прикрепленного файла {string} есть кнопка `Разместить в проекте`', async (title: string) => {
  await expect(await formControlTypeFileBlock.isFilesPlacementBtnExist(title)).toBeTruthy();
});

When('в поле файл у прикрепленного файла {string} нет кнопки `Разместить в проекте`', async (title: string) => {
  await expect(await formControlTypeFileBlock.isFilesPlacementBtnExist(title)).toBeFalsy();
});

Then('блок FormContent вариант {string} выглядит как положено', async (variant: string) => {
  await formContentBlock.assertSelfie(variant);
});

Then('блок FormControlTypeChoice вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeChoiceBlock.assertSelfie(variant);
});

Then('блок FormViewTypeChoice вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeChoiceBlock.assertSelfie(variant);
});

Then('блок FormControlTypeDocument вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeDocumentBlock.assertSelfie(variant);
});

Then('блок FormViewTypeDocument вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeDocumentBlock.assertSelfie(variant);
});

Then('блок FormControlTypeString вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeStringBlock.assertSelfie(variant);
});

Then('блок FormControlTypeFile вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeFileBlock.assertSelfie(variant);
});

Then('блок FormViewTypeString вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeStringBlock.assertSelfie(variant);
});

Then('блок FormControlTypeUser вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeUserBlock.assertSelfie(variant);
});

Then('блок FormViewTypeUser вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeUserBlock.assertSelfie(variant);
});

Then('блок FormViewTypeFile вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeFileBlock.assertSelfie(variant);
});

Then('в поле файл у набора файлов есть единственная кнопка `Удалить набор`', async () => {
  await expect(await formControlTypeFileBlock.isCompoundFileHaveSingleDeleteBtn()).toBeTruthy();
});

Then('в поле файл у набора файлов есть единственная кнопка `Скачать набор файлов архивом`', async () => {
  await expect(await formViewTypeFileBlock.isCompoundFileHaveSingleDownloadBtn()).toBeTruthy();
});

Then('в поле файл у набора файлов есть единственная кнопка `Разместить в проекте`', async () => {
  await expect(await formViewTypeFileBlock.isCompoundFileHaveSingleFilesPlacementBtn()).toBeTruthy();
});
