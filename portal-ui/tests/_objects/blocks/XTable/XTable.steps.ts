import { Then, When } from '@wdio/cucumber-framework';

import { xTableBlock } from './XTable.block';
import { xTableFilterTypeBoolBlock } from './Filter/_type/XTable-Filter_type_bool.block';
import { xTableFilterTypeChoiceBlock } from './Filter/_type/XTable-Filter_type_choice.block';
import { xTableFilterTypeDateTimeBlock } from './Filter/_type/XTable-Filter_type_dateTime.block';
import { xTableFilterTypeFloatBlock } from './Filter/_type/XTable-Filter_type_float.block';

Then(
  /^в первой колонке таблицы xtable содержатся только элементы:$/,
  async ({ rawTable }: { rawTable: string[][] }) => {
    const values = rawTable.flat();
    expect(values).toEqual(await xTableBlock.getFirstColCellValues());
  }
);

// TODO: код тестирования фильтров таблиц типов bool, choice, dateTime и float отрефакторить по примеру string

When(/^в таблице xtable c фильтром типа bool я нажимаю да$/, async () => {
  await xTableFilterTypeBoolBlock.setValueTrue();
});

When(/^в таблице xtable c фильтром типа bool я нажимаю нет$/, async () => {
  await xTableFilterTypeBoolBlock.setValueFalse();
});

Then(
  /^в таблице xtable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `да`$/,
  async () => {
    await xTableFilterTypeBoolBlock.checkFilterableTrueItems();
  }
);

Then(
  /^в таблице xtable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `нет`$/,
  async () => {
    await xTableFilterTypeBoolBlock.checkFilterableFalseItems();
  }
);

When(/^в таблице xtable я выбираю в поле фильтра типа choice первую опцию$/, async () => {
  await xTableFilterTypeChoiceBlock.setValue();
});

When(/^в таблице xtable я выбираю в поле фильтра типа choice вторую опцию$/, async () => {
  await xTableFilterTypeChoiceBlock.setValue2();
});

When(/^в таблице xtable я повторно выбираю в поле фильтра типа choice вторую опцию$/, async () => {
  await xTableFilterTypeChoiceBlock.setValue3();
});

Then(
  /^в таблице xtable с фильтром типа choice отображаются только элементы, значение которых подходит под выбранную опцию$/,
  async () => {
    await xTableFilterTypeChoiceBlock.checkFilterableOptionItems();
  }
);

Then(/^в таблице xtable с фильтром типа choice отображаются все элементы$/, async () => {
  await xTableFilterTypeChoiceBlock.checkFilterableItems();
});

When(
  /^в таблице xtable я ввожу в поле фильтра типа dateTime "(.*)" и "(.*)"$/,
  async (firstDate: string, secondDate: string) => {
    await xTableFilterTypeDateTimeBlock.setValue2(firstDate, secondDate);
  }
);

Then(
  /^в таблице xtable с фильтром типа datetime отображаются только элементы, значение которых подходит под введённое ограничение `от` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTimeBlock.checkFilterableLteItems();
  }
);

Then(
  /^в таблице xtable с фильтром типа dateTime отображаются только элементы, значение которых подходит под введённое ограничение `до` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTimeBlock.checkFilterableGteItems();
  }
);

Then(
  /^в таблице xtable с фильтром типа dateTime отображаются только элементы, значение которых подходит под оба введённых ограничения `от` `10.10.2016` `до` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTimeBlock.checkFilterableItems();
  }
);

When(/^в таблице xtable я ввожу в поле фильтра типа float "(.*)" и "(.*)"$/, async (lte: string, gte: string) => {
  await xTableFilterTypeFloatBlock.setValue2(lte, gte);
});

Then(
  /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `от` "(.*)"$/,
  async (lte: string) => {
    await xTableFilterTypeFloatBlock.checkFilterableLteItems(lte);
  }
);

Then(
  /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `до` "(.*)"$/,
  async (gte: string) => {
    await xTableFilterTypeFloatBlock.checkFilterableGteItems2(gte);
  }
);

Then(
  /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под оба введённых ограничения `от` "(.*)" `до` "(.*)"$/,
  async (lte: string, gte: string) => {
    await xTableFilterTypeFloatBlock.checkFilterableGteItems3(lte, gte);
  }
);
