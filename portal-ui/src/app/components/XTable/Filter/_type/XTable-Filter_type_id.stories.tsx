import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { XTable, XTableProps } from '../../XTable';
import { XTableColumn, XTableExtraColumnType } from '../../XTable.models';
import { Template } from '../XTable-Filter-story-template';

export default {
  title: 'XTable/Cols',
  component: XTable
};

interface TestData {
  id: number;
}

const data: TestData[] = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'ID',
    field: 'id',
    type: XTableExtraColumnType.ID,
    filterable: true,
    sortable: true
  }
];

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeId = Template.bind({}) as StoryFn<XTableForTestData>;
TypeId.args = {
  data,
  cols,
  defaultSort: { field: 'id', asc: true },
  showFiltersPanel: true,
  filterable: true,
  filtersAlwaysEnabled: true
};
