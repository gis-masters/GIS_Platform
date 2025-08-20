import React, { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { PropertyOption, PropertyType } from '../../services/data/schema/schema.models';
import { PageOptions, SortOrder } from '../../services/models';
import { filterObjects, prepareLike } from '../../services/util/filters/filterObjects';
import { sleep } from '../../services/util/sleep';
import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { smallData, testDataForTables } from './testDataForTables';
import { XTable, XTableProps } from './XTable';
import { XTableColumn } from './XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable.stories.scss';

export default {
  title: 'XTable',
  component: XTable
};

const Template: StoryFn<typeof XTable> = args => <XTable {...args} />;

export interface TestData {
  id: number;
  title: string;
  material?: string;
  weight: number;
  amount: number;
  date: string;
  conclusive?: boolean | null;
  documents?: string;
  long?: string;
}

const materialOptions: PropertyOption[] = [
  {
    title: 'Дерево',
    value: 'wood'
  },
  {
    title: 'Железо',
    value: 'iron'
  },
  {
    title: 'Стекло',
    value: 'glass'
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Название',
    field: 'title',
    getIdBadge: ({ id }) => id,
    filterable: true,
    sortable: true,
    hidden: false
  },
  {
    title: 'Материал',
    field: 'material',
    type: PropertyType.CHOICE,
    settings: {
      options: materialOptions
    },
    filterable: true,
    sortable: true,
    hidden: false
  },
  {
    title: 'Вес',
    description: 'в килограммах',
    type: PropertyType.FLOAT,
    filterable: true,
    field: 'weight',
    sortable: true
  },
  {
    title: 'Количество',
    align: 'center',
    field: 'amount',
    sortable: true
  },
  {
    title: 'Дата',
    filterable: true,
    type: PropertyType.DATETIME,
    align: 'center',
    field: 'date',
    sortable: true
  },
  {
    title: 'Решает',
    filterable: true,
    type: PropertyType.BOOL,
    align: 'center',
    field: 'conclusive',
    sortable: true
  },
  {
    field: 'long',
    title:
      'Просто ещё одна бесполезная колонка с длинным-предлинным многострочным названием и бессмысленным шаблонным описанием',
    description:
      'Бессмысленное шаблонное описание ещё одной бесполезной колонки с длинным-предлинным многострочным названием.'
  }
];

const colsWIthLongTitles: XTableColumn<TestData>[] = [
  {
    field: 'amount',
    sortable: true,
    title:
      'Колонка с длинным-предлинным многострочным названием + Колонка с длинным-предлинным многострочным названием + Колонка с длинным-предлинным многострочным названием',
    description:
      'Бессмысленное шаблонное описание ещё одной бесполезной колонки с длинным-предлинным многострочным названием.'
  },
  {
    field: 'long',
    title:
      'Просто ещё одна бесполезная колонка с длинным-предлинным многострочным названием и бессмысленным шаблонным описанием'
  }
];

const lastCol = cols.at(-1);
if (!lastCol) {
  throw new Error('Ошибка: нет колонок');
}

const colsWithDocuments: XTableColumn<TestData>[] = [
  ...cols.slice(0, -1),
  {
    title: 'Документы',
    filterable: true,
    type: PropertyType.DOCUMENT,
    align: 'center',
    field: 'documents',
    sortable: true
  },
  lastCol
];

const defaultSort: SortParams<TestData> = { field: 'title', asc: true };

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

async function getData({
  page,
  pageSize,
  filter,
  sort,
  sortOrder: sortDir
}: PageOptions): Promise<[TestData[], number]> {
  await sleep(Math.random() * 1000);

  const filtered = filterObjects(testDataForTables, prepareLike(filter || {}));
  const sorted = sortObjects(filtered, sort as keyof TestData, sortDir === SortOrder.ASC, 'id');
  const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

  return [paged, Math.ceil(filtered.length / pageSize)];
}

export const Small = Template.bind({}) as StoryFn<XTableForTestData>;
Small.args = {
  title: 'Таблица маленькая',
  data: smallData,
  cols: cols.slice(0, -1),
  defaultSort,
  secondarySortField: 'id'
};

export const Standard = Template.bind({}) as StoryFn<XTableForTestData>;
Standard.args = {
  title: 'Таблица с локальными данными',
  data: testDataForTables,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true
};

export const Async = Template.bind({}) as StoryFn<XTableForTestData>;
Async.args = {
  title: 'Таблица с данными с сервера',
  getData,
  cols: colsWithDocuments,
  defaultSort,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const FilterPanel = Template.bind({}) as StoryFn<XTableForTestData>;
FilterPanel.args = {
  data: testDataForTables,
  cols: colsWithDocuments,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const Compact = Template.bind({}) as StoryFn<XTableForTestData>;
Compact.args = {
  title: 'Компактная таблица с локальными данными',
  data: testDataForTables,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true,
  size: 'small',
  singleLineContent: true
};

export const RedundantColWidth = Template.bind({}) as StoryFn<XTableForTestData>;
RedundantColWidth.args = {
  title: 'Таблица с избыточной шириной колонки',
  data: testDataForTables,
  filtersAlwaysEnabled: true,
  cols: [cols[2]],
  singleLineContent: true,
  size: 'small'
};

export const RedundantColWidthMultiline = Template.bind({}) as StoryFn<XTableForTestData>;
RedundantColWidthMultiline.args = {
  title: 'Многострочная таблица с избыточной шириной колонки',
  data: testDataForTables,
  filtersAlwaysEnabled: true,
  cols: colsWIthLongTitles,
  filterable: true,
  defaultSort,
  size: 'small'
};
