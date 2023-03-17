import { ReactElement } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SortParams } from '../../../../services/util/sortObjects';
import { PropertyOption, PropertyType } from '../../../../services/data/schema/schema.models';

import { XTable, XTableColumn, XTableProps } from './../../XTable';
import { Template } from '../XTable-Filter-story-template';

export default {
  title: 'XTable/Cols/Choice',
  component: XTable
} as ComponentMeta<typeof XTable>;

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

export const ChoiceColWithFilter = Template.bind({}) as ComponentStory<XTableForTestData>;
ChoiceColWithFilter.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
