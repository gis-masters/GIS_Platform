import { Then, When } from '@wdio/cucumber-framework';

import { xTable } from './XTable.block';
import { xTableFilterTypeBool } from './Filter/_type/XTable-Filter_type_bool.block';
import { xTableFilterTypeChoice } from './Filter/_type/XTable-Filter_type_choice.block';
import { xTableFilterTypeDateTime } from './Filter/_type/XTable-Filter_type_dateTime.block';
import { xTableFilterTypeFloat } from './Filter/_type/XTable-Filter_type_float.block';

Then(
  /^в первой колонке таблицы xtable содержатся только элементы:$/,
  async ({ rawTable }: { rawTable: string[][] }) => {
    const values = rawTable.flat();
    expect(values).toEqual(await xTable.getFirstColCellValues());
  }
);

// TODO: код тестирования фильтров таблиц типов bool, choice, dateTime и float отрефакторить по примеру string

When(/^в таблице xtable c фильтром типа bool я нажимаю да$/, async () => {
  await xTableFilterTypeBool.setValueTrue();
});

When(/^в таблице xtable c фильтром типа bool я нажимаю нет$/, async () => {
  await xTableFilterTypeBool.setValueFalse();
});

Then(
  /^в таблице xtable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `да`$/,
  async () => {
    await xTableFilterTypeBool.checkFilterableTrueItems();
  }
);

Then(
  /^в таблице xtable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `нет`$/,
  async () => {
    await xTableFilterTypeBool.checkFilterableFalseItems();
  }
);

When(/^в таблице xtable я выбираю в поле фильтра типа choice первую опцию$/, async () => {
  await xTableFilterTypeChoice.setValue();
});

When(/^в таблице xtable я выбираю в поле фильтра типа choice вторую опцию$/, async () => {
  await xTableFilterTypeChoice.setValue2();
});

When(/^в таблице xtable я повторно выбираю в поле фильтра типа choice вторую опцию$/, async () => {
  await xTableFilterTypeChoice.setValue3();
});

Then(
  /^в таблице xtable с фильтром типа choice отображаются только элементы, значение которых подходит под выбранную опцию$/,
  async () => {
    await xTableFilterTypeChoice.checkFilterableOptionItems();
  }
);

Then(/^в таблице xtable с фильтром типа choice отображаются все элементы$/, async () => {
  await xTableFilterTypeChoice.checkFilterableItems();
});

When(
  /^в таблице xtable я ввожу в поле фильтра типа dateTime "(.*)" и "(.*)"$/,
  async (firstDate: string, secondDate: string) => {
    await xTableFilterTypeDateTime.setValue2(firstDate, secondDate);
  }
);

Then(
  /^в таблице xtable с фильтром типа datetime отображаются только элементы, значение которых подходит под введённое ограничение `от` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTime.checkFilterableLteItems();
  }
);

Then(
  /^в таблице xtable с фильтром типа dateTime отображаются только элементы, значение которых подходит под введённое ограничение `до` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTime.checkFilterableGteItems();
  }
);

Then(
  /^в таблице xtable с фильтром типа dateTime отображаются только элементы, значение которых подходит под оба введённых ограничения `от` `10.10.2016` `до` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTime.checkFilterableItems();
  }
);

When(/^в таблице xtable я ввожу в поле фильтра типа float "(.*)" и "(.*)"$/, async (lte: string, gte: string) => {
  await xTableFilterTypeFloat.setValue2(lte, gte);
});

Then(
  /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `от` "(.*)"$/,
  async (lte: string) => {
    await xTableFilterTypeFloat.checkFilterableLteItems(lte);
  }
);

Then(
  /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `до` "(.*)"$/,
  async (gte: string) => {
    await xTableFilterTypeFloat.checkFilterableGteItems2(gte);
  }
);

Then(
  /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под оба введённых ограничения `от` "(.*)" `до` "(.*)"$/,
  async (lte: string, gte: string) => {
    await xTableFilterTypeFloat.checkFilterableGteItems3(lte, gte);
  }
);
