import { Then, When } from '@wdio/cucumber-framework';

import { usersAddDialogBlock } from '../Users/AddDialog/Users-AddDialog.block';
import { formContentBlock } from './Content/Form-Content.block';
import { formControlTypeChoiceBlock } from './Control/Form-Control_type_choice.block';
import { formControlTypeDocumentBlock } from './Control/Form-Control_type_document.block';
import { formControlTypeFileBlock } from './Control/Form-Control_type_file.block';
import { formControlTypeStringBlock } from './Control/Form-Control_type_string.block';
import { formControlTypeUrlBlock } from './Control/Form-Control_type_url.block';
import { formControlTypeUserBlock } from './Control/Form-Control_type_user.block';
import { FormBlock } from './Form.block';
import { formViewTypeChoiceBlock } from './View/Form-View_type_choice.block';
import { formViewTypeDocumentBlock } from './View/Form-View_type_document.block';
import { formViewTypeFileBlock } from './View/Form-View_type_file.block';
import { formViewTypeStringBlock } from './View/Form-View_type_string.block';
import { formViewTypeUserBlock } from './View/Form-View_type_user.block';

Then('блок FormContent вариант {string} выглядит как положено', async (variant: string) => {
  await formContentBlock.assertSelfie(variant);
});

Then('в форме существует поле {string}', async (fieldTitle: string) => {
  const formBlock = new FormBlock();
  await expect(await formBlock.hasField(fieldTitle)).toBeTruthy();
});

Then('в форме существуют поля: {strings}', async (fieldTitles: string[]) => {
  const formBlock = new FormBlock();
  await expect(await formBlock.getAllFields()).toEqual(fieldTitles);
});

// url

When('в форме в поле {string} типа url я нажимаю на кнопку добавления нового url', async (title: string) => {
  await formControlTypeUrlBlock.clickAddUrlBtn(title);
});

When('в форме в поле {string} типа url я нажимаю на первую заполненную ссылку', async (title: string) => {
  await formControlTypeUrlBlock.clickFirstUrlLink(title);
});

// user

When('в форме в поле {string} типа user я нажимаю на кнопку `Добавить пользователя`', async (title: string) => {
  await formControlTypeUserBlock.clickAddUserBtn(title);
  await usersAddDialogBlock.waitForVisible();
  await usersAddDialogBlock.xTable.waitForLoading();
});

Then('блок FormControlTypeUser вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeUserBlock.assertSelfie(variant);
});

Then('блок FormViewTypeUser вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeUserBlock.assertSelfie(variant);
});

Then('блок FormControlTypeFile вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeFileBlock.assertSelfie(variant);
});

// choice

Then('блок FormControlTypeChoice вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeChoiceBlock.assertSelfie(variant);
});

Then('блок FormViewTypeChoice вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeChoiceBlock.assertSelfie(variant);
});

// document

Then('блок FormControlTypeDocument вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeDocumentBlock.assertSelfie(variant);
});

Then('блок FormViewTypeDocument вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeDocumentBlock.assertSelfie(variant);
});

// string

When('в форме в поле {string} типа string я ввожу текст {string}', async (title: string, text: string) => {
  const formBlock = new FormBlock();
  await formBlock.setStringValue(title, text);
});

Then('блок FormControlTypeString вариант {string} выглядит как положено', async (variant: string) => {
  await formControlTypeStringBlock.assertSelfie(variant);
});

Then('блок FormViewTypeString вариант {string} выглядит как положено', async (variant: string) => {
  await formViewTypeStringBlock.assertSelfie(variant);
});

// file

When('в поле файла у прикрепленного файла {string} есть кнопка `Разместить в проекте`', async (title: string) => {
  await expect(await formControlTypeFileBlock.isFilesPlacementBtnExist(title)).toBeTruthy();
});

When('в поле файл у прикрепленного файла {string} нет кнопки `Разместить в проекте`', async (title: string) => {
  await expect(await formControlTypeFileBlock.isFilesPlacementBtnExist(title)).toBeFalsy();
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
