import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { XTable, XTableProps } from '../XTable';
import { XTableColumn } from '../XTable.models';
import { TemplateWide } from './XTable-Filter-story-template';

export default {
  title: 'XTable/Filter',
  component: XTable
};

interface TestData {
  id: number;
  title: string;
  material: string;
}

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

const multipleFiltersData: TestData[] = [
  {
    id: 1,
    title: 'Стол',
    material: 'wood'
  },
  {
    id: 2,
    title: 'Стул',
    material: 'food'
  },
  {
    id: 3,
    title: 'Табурет',
    material: 'flood'
  }
];

const multipleFiltersCols: XTableColumn<TestData>[] = [
  {
    title: 'Название',
    field: 'title',
    filterable: true,
    sortable: true,
    hidden: false
  },
  {
    title: 'Материал',
    field: 'material',
    filterable: true,
    sortable: true,
    hidden: false
  }
];

export const MultipleStringFilters = TemplateWide.bind({}) as StoryFn<XTableForTestData>;
MultipleStringFilters.args = {
  data: multipleFiltersData,
  cols: multipleFiltersCols,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
