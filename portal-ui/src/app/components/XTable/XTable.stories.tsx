import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PropertyOption, PropertyType } from '../../services/data/schema.models';
import { sortObjects, SortParams } from '../../services/util/sortObjects';
import { filterObjects } from '../../services/util/filterObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { sleep } from '../../services/util/sleep';

import { XTable, XTableColumn } from './XTable';

import '!style-loader!css-loader!sass-loader!./XTable.stories.scss';

export default {
  title: 'XTable',
  component: XTable
} as ComponentMeta<typeof XTable>;

const Template: ComponentStory<typeof XTable> = args => <XTable {...args} />;

interface TestData {
  id: number;
  title: string;
  material?: string;
  weight: number;
  amount: number;
  date: string;
  conclusive?: boolean;
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

const smallData: TestData[] = [
  {
    id: 1,
    title: 'Стол',
    material: 'wood',
    weight: 14,
    amount: 1,
    date: '2021-12-16 15:30',
    conclusive: false
  },
  {
    id: 2,
    title: 'Стул',
    material: 'wood',
    weight: 4,
    amount: 6,
    date: '2001-10-10 12:00',
    conclusive: false
  },
  {
    id: 3,
    title: 'Табурет',
    material: 'wood',
    weight: 3,
    amount: 2,
    date: '1976-01-14 17:00',
    conclusive: false
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
    date: '1993-02-18 11:30',
    conclusive: false
  },
  {
    id: 5,
    title: 'Трон',
    material: 'iron',
    amount: 1,
    weight: 420,
    date: '1021-12-12 12:00',
    conclusive: false,
    long: 'Какой-то длинный предлинный многострочный текст со всякой фигнёй, чтобы точно не влезло в одну строку, а также соСлипшимисяДоНелепостиДлиннымиСловамиЧтобыТочноРаскосматилоПоШирине'
  },
  {
    id: 6,
    title: 'Тумба',
    material: 'wood',
    amount: 2,
    weight: 16,
    date: '2016-06-13 13:13',
    conclusive: false
  },
  {
    id: 7,
    title: 'Кровать',
    material: 'iron',
    amount: 1,
    weight: 80,
    date: '2013-08-02 14:00',
    conclusive: false
  },
  {
    id: 8,
    title: 'Зеркало',
    material: 'glass',
    amount: 2,
    weight: 10,
    date: '2002-03-16 11:15',
    conclusive: false
  },
  {
    id: 9,
    title: 'Кровать детская',
    material: 'wood',
    amount: 3,
    weight: 30,
    date: '2017-08-05 5:30',
    conclusive: false
  },
  {
    id: 10,
    title: 'Тапочница',
    material: 'wood',
    amount: 1,
    weight: 6,
    date: '2020-10-10 10:00',
    conclusive: false
  },
  {
    id: 11,
    title: 'Вешалка',
    material: 'iron',
    amount: 1,
    weight: 8,
    date: '2016-07-17 17:20',
    conclusive: false
  },
  {
    id: 12,
    title: 'Комод',
    material: 'wood',
    amount: 2,
    weight: 60,
    date: '2017-06-16 16:15',
    conclusive: false
  },
  {
    id: 13,
    title: 'Трюмо',
    material: 'glass',
    amount: 1,
    weight: 110,
    date: '1981-11-11 11:11',
    conclusive: false
  },
  {
    id: 14,
    title: 'Шкаф платяной',
    material: 'wood',
    amount: 3,
    weight: 210,
    date: '2015-10-15 15:15',
    conclusive: false
  },
  {
    id: 15,
    title: 'Шкаф стенной',
    material: 'wood',
    amount: 2,
    weight: 110,
    date: '2022-12-13 23:30',
    conclusive: false
  },
  {
    id: 16,
    title: 'Буфет',
    material: 'wood',
    amount: 1,
    weight: 130,
    date: '2021-12-18 18:30',
    conclusive: false
  },
  {
    id: 17,
    title: 'Пуфик',
    material: 'textile',
    amount: 10,
    weight: 4,
    date: '2019-05-19 19:10',
    conclusive: false
  },
  {
    id: 18,
    title: 'Гроб',
    material: 'wood',
    amount: 1,
    weight: 80,
    date: '2005-10-10 10:30',
    conclusive: false
  },
  {
    id: 19,
    title: 'Дыба',
    material: 'wood',
    amount: 1,
    weight: 320,
    date: '1321-03-16 6:45',
    conclusive: true
  },
  {
    id: 20,
    title: 'Идея стула',
    amount: 1,
    weight: 0,
    date: '321-03-16 6:45'
  },
  {
    id: 21,
    title: 'Скатерть',
    amount: 1,
    weight: 0.2,
    date: '2021-03-16 12:45',
    conclusive: null
  },
  {
    id: 22,
    title: 'Эвкалиптовая кровать',
    amount: 1,
    weight: 250,
    date: '2021-03-18 13:00',
    conclusive: null
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

const defaultSort: SortParams<TestData> = { field: 'title', asc: true };

class XTableForTestData extends XTable<TestData> {}

async function getData({
  page,
  pageSize,
  filter,
  sort,
  sortOrder: sortDir
}: PageOptions): Promise<[TestData[], number]> {
  await sleep(Math.random() * 1000);

  const filtered = filterObjects(data, filter);
  const sorted = sortObjects(filtered, sort as keyof TestData, sortDir === SortOrder.ASC, 'id');
  const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

  return [paged, Math.ceil(filtered.length / pageSize)];
}

export const Small = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Small.args = {
  title: 'Таблица маленькая',
  data: smallData,
  cols: cols.slice(0, -1),
  defaultSort,
  secondarySortField: 'id'
};

export const Standard = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Standard.args = {
  title: 'Таблица с локальными данными',
  data,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true
};

export const Async = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Async.args = {
  title: 'Таблица с данными с сервера',
  getData,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const FilterPanel = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
FilterPanel.args = {
  getData,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const Compact = Template.bind({}) as ComponentStory<typeof XTableForTestData>;
Compact.args = {
  title: 'Компактная таблица с локальными данными',
  data,
  cols,
  defaultSort,
  secondarySortField: 'id',
  filterable: true,
  size: 'small',
  singleLineContent: true
};
