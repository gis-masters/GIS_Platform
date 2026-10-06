import { Then, When } from '@wdio/cucumber-framework';

import { chooseXTableBlock } from './ChooseXTable.block';

When('в таблице выбора я выбираю пункт, где {string} равно {string}', async function (colTitle: string, value: string) {
  await chooseXTableBlock.waitForVisible();
  await chooseXTableBlock.selectOne(colTitle, value);
});

When(
  'в таблице выбора я нажимаю переключатель строки, где {string} равно {string}',
  async function (colTitle: string, value: string) {
    await chooseXTableBlock.waitForVisible();
    await chooseXTableBlock.clickCheckByColValue(colTitle, value);
  }
);

When('в таблице выбора я нажимаю чекбокс select-all в шапке', async () => {
  await chooseXTableBlock.waitForVisible();
  await chooseXTableBlock.clickSelectAll();
});

When(
  'в таблице выбора я навожусь на переключатель строки, где {string} равно {string}',
  async function (colTitle: string, value: string) {
    await chooseXTableBlock.waitForVisible();
    await chooseXTableBlock.hoverCheckByColValue(colTitle, value);
  }
);

Then(
  'в таблице выбора переключатель строки, где {string} равно {string}, недоступен',
  async function (colTitle: string, value: string) {
    await chooseXTableBlock.waitForVisible();
    expect(await chooseXTableBlock.isCheckDisabled(colTitle, value)).toBe(true);
  }
);

Then(
  'в таблице выбора переключатель строки, где {string} равно {string}, доступен',
  async function (colTitle: string, value: string) {
    await chooseXTableBlock.waitForVisible();
    expect(await chooseXTableBlock.isCheckDisabled(colTitle, value)).toBe(false);
  }
);

Then(
  'в таблице выбора переключатель строки, где {string} равно {string}, отмечен',
  async function (colTitle: string, value: string) {
    await chooseXTableBlock.waitForVisible();
    expect(await chooseXTableBlock.isCheckChecked(colTitle, value)).toBe(true);
  }
);

Then(
  'в таблице выбора переключатель строки, где {string} равно {string}, не отмечен',
  async function (colTitle: string, value: string) {
    await chooseXTableBlock.waitForVisible();
    expect(await chooseXTableBlock.isCheckChecked(colTitle, value)).toBe(false);
  }
);

Then('в таблице выбора все переключатели строк доступны', async () => {
  await chooseXTableBlock.waitForVisible();
  expect(await chooseXTableBlock.areAllRowChecksEnabled()).toBe(true);
});

Then('в таблице выбора нет чекбокса select-all в шапке', async () => {
  await chooseXTableBlock.waitForVisible();
  expect(await chooseXTableBlock.hasSelectAll()).toBe(false);
});

Then('в таблице выбора чекбокс select-all в шапке отмечен', async () => {
  await chooseXTableBlock.waitForVisible();
  expect(await chooseXTableBlock.getSelectAllAriaChecked()).toBe('true');
});

Then('в таблице выбора чекбокс select-all в шапке не отмечен', async () => {
  await chooseXTableBlock.waitForVisible();
  expect(await chooseXTableBlock.getSelectAllAriaChecked()).toBe('false');
});

Then('в таблице выбора чекбокс select-all в шапке в состоянии indeterminate', async () => {
  await chooseXTableBlock.waitForVisible();
  expect(await chooseXTableBlock.getSelectAllAriaChecked()).toBe('mixed');
});

Then('в таблице выбора счётчик выбора содержит {string}', async (expected: string) => {
  await chooseXTableBlock.waitForVisible();
  expect(await chooseXTableBlock.getTitleCountText()).toContain(expected);
});

Then('появляется всплывающая подсказка {string}', async (expected: string) => {
  expect(await chooseXTableBlock.getOpenTooltipText()).toBe(expected);
});
