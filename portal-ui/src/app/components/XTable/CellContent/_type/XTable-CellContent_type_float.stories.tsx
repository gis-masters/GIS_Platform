/* eslint-disable sonarjs/no-duplicate-string */
import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { SortParams } from '../../../../services/util/sortObjects';
import { Template } from '../../Filter/XTable-Filter-story-template';
import { XTable, XTableProps } from '../../XTable';
import { XTableColumn } from '../../XTable.models';

export default {
  title: 'XTable/CellContent',
  component: XTable
};

interface TestData {
  id: number;
  weight: number;
}

const data: TestData[] = [
  {
    id: 4,
    weight: 20.234_523_4
  },
  {
    id: 5,
    weight: 14.090_888_899
  },
  {
    id: 6,
    weight: 4.1
  },
  {
    id: 7,
    weight: 3.99
  },
  {
    id: 8,
    weight: 420.0001
  },
  {
    id: 9,
    weight: 16
  }
];

const colsWithPrecision3: XTableColumn<TestData>[] = [
  {
    title: 'Вес',
    description: 'в килограммах',
    type: PropertyType.FLOAT,
    filterable: true,
    settings: {
      precision: 3
    },
    field: 'weight',
    sortable: true
  }
];

const colsWithPrecision0: XTableColumn<TestData>[] = [
  {
    title: 'Вес',
    description: 'в килограммах',
    type: PropertyType.FLOAT,
    filterable: true,
    settings: {
      precision: 0
    },
    field: 'weight',
    sortable: true
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

export const TypeFloatWithPrecision3 = Template.bind({}) as StoryFn<XTableForTestData>;
TypeFloatWithPrecision3.args = {
  data,
  cols: colsWithPrecision3,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const TypeFloatWithPrecision0 = Template.bind({}) as StoryFn<XTableForTestData>;
TypeFloatWithPrecision0.args = {
  data,
  cols: colsWithPrecision0,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
