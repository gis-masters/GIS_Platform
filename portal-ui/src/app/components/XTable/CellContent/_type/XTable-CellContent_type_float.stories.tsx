/* eslint-disable sonarjs/no-duplicate-string */
import { ReactElement } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SortParams } from '../../../../services/util/sortObjects';
import { PropertyType } from '../../../../services/data/schema/schema.models';

import { XTable, XTableProps } from './../../XTable';
import { XTableColumn } from './../../XTable.models';
import { Template } from '../../Filter/XTable-Filter-story-template';

export default {
  title: 'XTable/CellContent',
  component: XTable
} as ComponentMeta<typeof XTable>;

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

const colsWithPresicion3: XTableColumn<TestData>[] = [
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

const colsWithPresicion0: XTableColumn<TestData>[] = [
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

export const TypeFloat = Template.bind({}) as ComponentStory<XTableForTestData>;
TypeFloat.args = {
  data,
  cols,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const TypeFloatWithPrecision3 = Template.bind({}) as ComponentStory<XTableForTestData>;
TypeFloatWithPrecision3.args = {
  data,
  cols: colsWithPresicion3,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};

export const TypeFloatWithPrecision0 = Template.bind({}) as ComponentStory<XTableForTestData>;
TypeFloatWithPrecision0.args = {
  data,
  cols: colsWithPresicion0,
  defaultSort,
  showFiltersPanel: true,
  secondarySortField: 'id',
  filterable: true,
  filtersAlwaysEnabled: true
};
