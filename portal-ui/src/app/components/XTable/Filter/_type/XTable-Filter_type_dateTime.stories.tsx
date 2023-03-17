import { ReactElement } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SortParams } from '../../../../services/util/sortObjects';
import { PropertyType } from '../../../../services/data/schema/schema.models';

import { XTable, XTableColumn, XTableProps } from './../../XTable';
import { Template } from '../XTable-Filter-story-template';

export default {
  title: 'XTable/Cols/DateTime',
  component: XTable
} as ComponentMeta<typeof XTable>;

interface TestData {
  id: number;
  date: string;
}

const data: TestData[] = [
  {
    id: 4,
    date: '2017-08-05 5:30'
  },
  {
    id: 5,
    date: '2013-08-02 14:00'
  },
  {
    id: 6,
    date: '2016-06-13 13:13'
  },
  {
    id: 7,
    date: '2017-06-16 16:15'
  },
  {
    id: 8,
    date: '2021-12-18 18:30'
  },
  {
    id: 9,
    date: '2019-05-19 19:10'
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Дата',
    filterable: true,
    type: PropertyType.DATETIME,
    align: 'center',
    field: 'date',
    sortable: true
  }
];

const defaultSort: SortParams<TestData> = { field: 'date', asc: true };

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const DateTimeColWithFilter = Template.bind({}) as ComponentStory<XTableForTestData>;
DateTimeColWithFilter.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
