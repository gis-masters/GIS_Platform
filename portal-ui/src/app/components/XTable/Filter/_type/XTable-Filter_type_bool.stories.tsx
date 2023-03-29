import { ReactElement } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SortParams } from '../../../../services/util/sortObjects';
import { PropertyType } from '../../../../services/data/schema/schema.models';

import { XTable, XTableProps } from './../../XTable';
import { XTableColumn } from './../../XTable.models';
import { Template } from '../XTable-Filter-story-template';

export default {
  title: 'XTable/Cols',
  component: XTable
} as ComponentMeta<typeof XTable>;

interface TestData {
  id: number;
  conclusive: boolean;
  conclusiveDescription: string;
}

const data: TestData[] = [
  {
    id: 4,
    conclusive: false,
    conclusiveDescription: 'нет'
  },
  {
    id: 5,
    conclusive: true,
    conclusiveDescription: 'да'
  },
  {
    id: 6,
    conclusive: false,
    conclusiveDescription: 'нет'
  },
  {
    id: 7,
    conclusive: true,
    conclusiveDescription: 'да'
  },
  {
    id: 8,
    conclusive: true,
    conclusiveDescription: 'да'
  },
  {
    id: 9,
    conclusive: true,
    conclusiveDescription: 'да'
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Решает',
    filterable: true,
    type: PropertyType.BOOL,
    align: 'center',
    field: 'conclusive',
    sortable: true
  },
  {
    title: 'Описание',
    type: PropertyType.STRING,
    align: 'center',
    field: 'conclusiveDescription'
  }
];

const defaultSort: SortParams<TestData> = { field: 'conclusive', asc: true };

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeBool = Template.bind({}) as ComponentStory<XTableForTestData>;
TypeBool.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
