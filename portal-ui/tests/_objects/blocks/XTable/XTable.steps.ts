import { Then, When } from '@wdio/cucumber-framework';

import { xTableFilterTypeBoolBlock } from './Filter/_type/XTable-Filter_type_bool.block';
import { xTableFilterTypeChoiceBlock } from './Filter/_type/XTable-Filter_type_choice.block';
import { xTableFilterTypeDateTimeBlock } from './Filter/_type/XTable-Filter_type_dateTime.block';
import { xTableFilterTypeFloatBlock } from './Filter/_type/XTable-Filter_type_float.block';
import { xTableBlock } from './XTable.block';

Then('в первой колонке таблицы xTable содержатся только элементы:', async ({ rawTable }: { rawTable: string[][] }) => {
  const values = rawTable.flat();
  await expect(values).toEqual(await xTableBlock.getFirstColCellValues());
});

When('в таблице в первой колонке я навожусь на заголовок', async () => {
  await xTableBlock.focusFirstColTitle();
});

Then('в первой колонке таблицы xTable содержатся только элементы {string}', async (valuesDirty: string) => {
  const values = valuesDirty.split(', ');
  await expect(values).toEqual(await xTableBlock.getFirstColCellValues());
});

Then('таблица xTable не содержит записей', async () => {
  await expect(await xTableBlock.getFirstColCellValues()).toEqual([]);
});

Then('блок xTable вариант {string} выглядит как положено', async (variant: string) => {
  await xTableBlock.assertSelfie(variant);
});

// фильтр document

When(
  'в таблице xTable я ввожу в фильтр поля типа document {string} значение {string}',
  async (colTitle: string, filter: string) => {
    await xTableBlock.filterDocumentColumn(colTitle, filter);
  }
);

// фильтр string

When(
  'в таблице xTable я ввожу в фильтр поля типа string {string} значение {string}',
  async (colTitle: string, filter: string) => {
    await xTableBlock.filterStringColumn(colTitle, filter);
  }
);

Then(
  'в таблице xTable фильтр поля {string} заполнен значением {string}',
  async function (title: string, value: string) {
    await browser.waitUntil(async () => {
      const actual = await xTableBlock.getFilterValue(title);

      return actual === value;
    });
  }
);

// фильтр bool

When('в таблице xTable в колонке {string} c фильтром типа bool я нажимаю да', async (title: string) => {
  await xTableFilterTypeBoolBlock.setValueTrue(title);
});

When('в таблице xTable в колонке {string} c фильтром типа bool я нажимаю нет', async (title: string) => {
  await xTableFilterTypeBoolBlock.setValueFalse(title);
});

Then(
  'в таблице xTable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `да`',
  async () => {
    await xTableFilterTypeBoolBlock.checkFilterableTrueItems();
  }
);

Then(
  'в таблице xTable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `нет`',
  async () => {
    await xTableFilterTypeBoolBlock.checkFilterableFalseItems();
  }
);

// фильтр choice

When('в таблице xTable я выбираю в поле фильтра типа choice первую опцию', async () => {
  await xTableFilterTypeChoiceBlock.setValue();
});

When('в таблице xTable я выбираю в поле фильтра типа choice вторую опцию', async () => {
  await xTableFilterTypeChoiceBlock.setValue2();
});

When('в таблице xTable я повторно выбираю в поле фильтра типа choice вторую опцию', async () => {
  await xTableFilterTypeChoiceBlock.setValue3();
});

Then(
  'в таблице xTable с фильтром типа choice отображаются только элементы, значение которых подходит под выбранную опцию',
  async () => {
    await xTableFilterTypeChoiceBlock.checkFilterableOptionItems();
  }
);

Then('в таблице xTable с фильтром типа choice отображаются все элементы', async () => {
  await xTableFilterTypeChoiceBlock.checkFilterableItems();
});

// фильтр dateTime

When(
  'в таблице xTable я ввожу в поле фильтра типа dateTime {string} и {string}',
  async (firstDate: string, secondDate: string) => {
    await xTableFilterTypeDateTimeBlock.setValue2(firstDate, secondDate);
  }
);

When(
  'в таблице xtable я ввожу в поле фильтра {string} типа string значение {string}',
  async (fieldTitle: string, title: string) => {
    await xTableBlock.filterStringColumn(fieldTitle, title);
  }
);

Then(
  /^в таблице xTable с фильтром типа dateTime отображаются только элементы, значение которых подходит под введённое ограничение `от` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTimeBlock.checkFilterableLteItems();
  }
);

Then(
  /^в таблице xTable с фильтром типа dateTime отображаются только элементы, значение которых подходит под введённое ограничение `до` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTimeBlock.checkFilterableGteItems();
  }
);

Then(
  /^в таблице xTable с фильтром типа dateTime отображаются только элементы, значение которых подходит под оба введённых ограничения `от` `10.10.2016` `до` `10.10.2017`$/,
  async () => {
    await xTableFilterTypeDateTimeBlock.checkFilterableItems();
  }
);

// фильтр float

When(
  'в таблице xTable я ввожу в поле фильтра типа float {string} от {string} до {string}',
  async (colTitle: string, lte: string, gte: string) => {
    await xTableBlock.filterNumerableColumn(colTitle, lte, gte);
  }
);

When('в таблице xTable я ввожу в поле фильтра типа float {string} и {string}', async (lte: string, gte: string) => {
  await xTableFilterTypeFloatBlock.setValue2(lte, gte);
});

Then(
  /^в таблице xTable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `от` "(.*)"$/,
  async (lte: string) => {
    await xTableFilterTypeFloatBlock.checkFilterableLteItems(lte);
  }
);

Then(
  /^в таблице xTable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `до` "(.*)"$/,
  async (gte: string) => {
    await xTableFilterTypeFloatBlock.checkFilterableGteItems2(gte);
  }
);

Then(
  /^в таблице xTable с фильтром типа float отображаются только элементы, значение которых подходит под оба введённых ограничения `от` "(.*)" `до` "(.*)"$/,
  async (lte: string, gte: string) => {
    await xTableFilterTypeFloatBlock.checkFilterableGteItems3(lte, gte);
  }
);
