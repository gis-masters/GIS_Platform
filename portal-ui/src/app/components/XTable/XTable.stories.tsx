import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { PageOptions, SortDir } from '../../services/models';

import { XTable, XTableColumn } from './XTable';
import { sleep } from '../../services/util/sleep';
import { filterObjects } from '../../services/util/filterObjects';

export default {
  title: 'Example/XTable',
  component: XTable
} as ComponentMeta<typeof XTable>;

const Template: ComponentStory<typeof XTable> = args => <XTable {...args} />;

interface TestData {
  id: number;
  title: string;
  weight: number;
  amount: number;
}

const smallData: TestData[] = [
  {
    id: 1,
    title: 'Стол',
    weight: 14,
    amount: 1
  },
  {
    id: 2,
    title: 'Стул',
    weight: 4,
    amount: 6
  },
  {
    id: 3,
    title: 'Табурет',
    weight: 3,
    amount: 2
  }
];

const data: TestData[] = [
  ...smallData,
  {
    id: 4,
    title: 'Кресло',
    amount: 1,
    weight: 20
  },
  {
    id: 5,
    title: 'Трон',
    amount: 1,
    weight: 420
  },
  {
    id: 6,
    title: 'Тумба',
    amount: 2,
    weight: 16
  },
  {
    id: 7,
    title: 'Кровать',
    amount: 1,
    weight: 80
  },
  {
    id: 8,
    title: 'Зеркало',
    amount: 2,
    weight: 10
  },
  {
    id: 9,
    title: 'Кровать детская',
    amount: 3,
    weight: 30
  },
  {
    id: 10,
    title: 'Тапочница',
    amount: 1,
    weight: 6
  },
  {
    id: 11,
    title: 'Вешалка',
    amount: 1,
    weight: 8
  },
  {
    id: 12,
    title: 'Комод',
    amount: 2,
    weight: 60
  },
  {
    id: 13,
    title: 'Трюмо',
    amount: 1,
    weight: 110
  },
  {
    id: 14,
    title: 'Шкаф платяной',
    amount: 3,
    weight: 210
  },
  {
    id: 15,
    title: 'Шкаф стеной',
    amount: 2,
    weight: 110
  },
  {
    id: 16,
    title: 'Буфет',
    amount: 1,
    weight: 130
  },
  {
    id: 17,
    title: 'Пуфик',
    amount: 10,
    weight: 4
  },
  {
    id: 18,
    title: 'Гроб',
    amount: 1,
    weight: 80
  },
  {
    id: 19,
    title: 'Дыба',
    amount: 1,
    weight: 320
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Название',
    field: 'title',
    getIdBadge: ({ id }) => id,
    filterable: true,
    sortable: true
  },
  {
    title: 'Вес',
    field: 'weight',
    sortable: true
  },
  {
    title: 'Количество',
    field: 'amount',
    sortable: true
  }
];

const defaultSort: SortParams<TestData> = { field: 'title', asc: true };

class XTableForTestData extends XTable<TestData> {}

async function getData({ page, pageSize, filter, sort, sortDir }: PageOptions): Promise<[TestData[], number]> {
  await sleep(Math.random() * 1000);

  const filtered = filterObjects(data, filter);
  const sorted = sortObjects(filtered, sort as keyof TestData, sortDir === SortDir.ASC, 'id');
  const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

  return [paged, Math.ceil(filtered.length / pageSize)];
}

export const Small = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Small.args = {
  title: 'Таблица маленькая',
  data: smallData,
  cols,
  defaultSort,
  secondarySortField: 'id',
  getRowId: ({ id }) => id
};

export const Standard = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Standard.args = {
  title: 'Таблица с локальными данными',
  data,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true,
  getRowId: ({ id }) => id
};

export const Async = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Async.args = {
  title: 'Таблица с данными с сервера',
  getData,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true,
  getRowId: ({ id }) => id
};
