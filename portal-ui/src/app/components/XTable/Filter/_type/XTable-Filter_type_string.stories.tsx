import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { SortParams } from '../../../../services/util/sortObjects';
import { XTable, XTableProps } from '../../XTable';
import { XTableColumn } from '../../XTable.models';
import { Template } from '../XTable-Filter-story-template';

export default {
  title: 'XTable/Cols',
  component: XTable
};

interface TestData {
  id: number;
  title: string;
}

const data: TestData[] = [
  {
    id: 4,
    title: 'Кресло'
  },
  {
    id: 5,
    title: 'Трон'
  },
  {
    id: 6,
    title: 'Тумба'
  },
  {
    id: 7,
    title: 'Кровать'
  },
  {
    id: 8,
    title: 'Зеркало'
  },
  {
    id: 9,
    title: 'Кровать детская'
  },
  {
    id: 10,
    title: 'Тапочница'
  },
  {
    id: 11,
    title: 'Вешалка'
  },
  {
    id: 12,
    title: 'Комод'
  },
  {
    id: 13,
    title: 'Трюмо'
  },
  {
    id: 14,
    title: 'Шкаф платяной'
  },
  {
    id: 15,
    title: 'Шкаф стенной'
  },
  {
    id: 16,
    title: 'Буфет'
  },
  {
    id: 17,
    title: 'Пуфик'
  },
  {
    id: 18,
    title: 'Гроб'
  },
  {
    id: 19,
    title: 'Дыба'
  },
  {
    id: 20,
    title: 'Идея стула'
  },
  {
    id: 21,
    title: 'Скатерть'
  },
  {
    id: 22,
    title: 'Двуспальная кровать'
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Название',
    field: 'title',
    filterable: true,
    sortable: true,
    hidden: false
  }
];

const defaultSort: SortParams<TestData> = { field: 'title', asc: true };

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeString = Template.bind({}) as StoryFn<XTableForTestData>;
TypeString.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
