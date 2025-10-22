import { type ReactElement } from 'react';
import { type StoryFn } from '@storybook/react';

import { type PropertyOption, PropertyType } from '../../../../services/data/schema/schema.models';
import { type SortParams } from '../../../../services/util/sortObjects';
import { XTable, type XTableProps } from '../../XTable';
import { type XTableColumn } from '../../XTable.models';
import { Template } from '../XTable-Filter-story-template';

export default {
  title: 'XTable/Cols',
  component: XTable
};

interface TestData {
  id: number;
  material: string;
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

const data: TestData[] = [
  {
    id: 4,
    material: 'wood'
  },
  {
    id: 5,
    material: 'iron'
  },
  {
    id: 6,
    material: 'glass'
  },
  {
    id: 7,
    material: 'iron'
  },
  {
    id: 8,
    material: 'glass'
  },
  {
    id: 9,
    material: 'glass'
  }
];

const cols: XTableColumn<TestData>[] = [
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
  }
];

const defaultSort: SortParams<TestData> = { field: 'material', asc: true };

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeChoice = Template.bind({}) as StoryFn<XTableForTestData>;
TypeChoice.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
