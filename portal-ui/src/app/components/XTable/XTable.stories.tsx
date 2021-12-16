import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { filterObjects } from '../../services/util/filterObjects';
import { PropertyOption } from '../../services/crg/schema.models';
import { PageOptions, SortDir } from '../../services/models';
import { sleep } from '../../services/util/sleep';

import { XTable, XTableColumn } from './XTable';
import { FilterType } from './Filter/XTable-Filter';

export default {
  title: 'Example/XTable',
  component: XTable
} as ComponentMeta<typeof XTable>;

const Template: ComponentStory<typeof XTable> = args => <XTable {...args} />;

interface TestData {
  id: number;
  title: string;
  material: string;
  weight: number;
  amount: number;
  date: string;
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

const smallData: TestData[] = [
  {
    id: 1,
    title: 'Стол',
    material: 'wood',
    weight: 14,
    amount: 1,
    date: '2021-12-16 15:30'
  },
  {
    id: 2,
    title: 'Стул',
    material: 'wood',
    weight: 4,
    amount: 6,
    date: '2001-10-10 12:00'
  },
  {
    id: 3,
    title: 'Табурет',
    material: 'wood',
    weight: 3,
    amount: 2,
    date: '1976-01-14 17:00'
  }
];

const data: TestData[] = [
  ...smallData,
  {
    id: 4,
    title: 'Кресло',
    material: 'wood',
    amount: 1,
    weight: 20,
    date: '1993-02-18 11:30'
  },
  {
    id: 5,
    title: 'Трон',
    material: 'iron',
    amount: 1,
    weight: 420,
    date: '1021-12-12 12:00'
  },
  {
    id: 6,
    title: 'Тумба',
    material: 'wood',
    amount: 2,
    weight: 16,
    date: '2016-06-13 13:13'
  },
  {
    id: 7,
    title: 'Кровать',
    material: 'iron',
    amount: 1,
    weight: 80,
    date: '2013-08-02 14:00'
  },
  {
    id: 8,
    title: 'Зеркало',
    material: 'glass',
    amount: 2,
    weight: 10,
    date: '2002-03-16 11:15'
  },
  {
    id: 9,
    title: 'Кровать детская',
    material: 'wood',
    amount: 3,
    weight: 30,
    date: '2017-08-05 5:30'
  },
  {
    id: 10,
    title: 'Тапочница',
    material: 'wood',
    amount: 1,
    weight: 6,
    date: '2020-10-10 10:00'
  },
  {
    id: 11,
    title: 'Вешалка',
    material: 'iron',
    amount: 1,
    weight: 8,
    date: '2016-07-17 17:20'
  },
  {
    id: 12,
    title: 'Комод',
    material: 'wood',
    amount: 2,
    weight: 60,
    date: '2017-06-16 16:15'
  },
  {
    id: 13,
    title: 'Трюмо',
    material: 'glass',
    amount: 1,
    weight: 110,
    date: '1981-11-11 11:11'
  },
  {
    id: 14,
    title: 'Шкаф платяной',
    material: 'wood',
    amount: 3,
    weight: 210,
    date: '2015-10-15 15:15'
  },
  {
    id: 15,
    title: 'Шкаф стенной',
    material: 'wood',
    amount: 2,
    weight: 110,
    date: '2022-12-13 23:30'
  },
  {
    id: 16,
    title: 'Буфет',
    material: 'wood',
    amount: 1,
    weight: 130,
    date: '2021-12-18 18:30'
  },
  {
    id: 17,
    title: 'Пуфик',
    material: 'textile',
    amount: 10,
    weight: 4,
    date: '2019-05-19 19:10'
  },
  {
    id: 18,
    title: 'Гроб',
    material: 'wood',
    amount: 1,
    weight: 80,
    date: '2005-10-10 10:30'
  },
  {
    id: 19,
    title: 'Дыба',
    material: 'wood',
    amount: 1,
    weight: 320,
    date: '1321-03-16 6:45'
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
    title: 'Материал',
    field: 'material',
    filterable: true,
    filterType: FilterType.CHOICE,
    filterOptions: materialOptions,
    CellContent: ({ rowData }) => (
      <>{materialOptions.find(({ value }) => value === rowData.material)?.title || rowData.material}</>
    ),
    sortable: true
  },
  {
    title: 'Вес',
    filterable: true,
    filterType: FilterType.FLOAT,
    align: 'center',
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
    filterType: FilterType.DATETIME,
    align: 'center',
    field: 'date',
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
