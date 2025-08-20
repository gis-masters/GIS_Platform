import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { PropertyType } from '../../../../services/data/schema/schema.models';
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
  weight: number;
}

const data: TestData[] = [
  {
    id: 4,
    weight: 20
  },
  {
    id: 5,
    weight: 14
  },
  {
    id: 6,
    weight: 4
  },
  {
    id: 7,
    weight: 3
  },
  {
    id: 8,
    weight: 420
  },
  {
    id: 9,
    weight: 16
  },
  {
    id: 10,
    weight: 80
  },
  {
    id: 11,
    weight: 10
  },
  {
    id: 12,
    weight: 30
  },
  {
    id: 13,
    weight: 6
  },
  {
    id: 14,
    weight: 8
  },
  {
    id: 15,
    weight: 60
  },
  {
    id: 16,
    weight: 110
  },
  {
    id: 17,
    weight: 210
  },
  {
    id: 18,
    weight: 0.2
  },
  {
    id: 19,
    weight: 130
  },
  {
    id: 20,
    weight: 4
  },
  {
    id: 21,
    weight: 0
  },
  {
    id: 22,
    weight: 320
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Вес',
    description: 'в килограммах',
    type: PropertyType.FLOAT,
    filterable: true,
    field: 'weight',
    sortable: true
  }
];

const defaultSort: SortParams<TestData> = { field: 'weight', asc: true };

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeFloat = Template.bind({}) as StoryFn<XTableForTestData>;
TypeFloat.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
