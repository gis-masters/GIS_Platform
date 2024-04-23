import React from 'react';
import { StoryFn } from '@storybook/react';

import { PropertyType } from '../../services/data/schema/schema.models';
import { testDataForTables } from '../XTable/testDataForTables';
import { XTableColumn } from '../XTable/XTable.models';
import { TestData } from '../XTable/XTable.stories';
import { ChooseXTableDialog } from './ChooseXTableDialog';

export default {
  title: 'ChooseXTableDialog',
  component: ChooseXTableDialog
};

const cols: XTableColumn<TestData>[] = [
  {
    field: 'id',
    type: PropertyType.INT,
    title: 'ID',
    filterable: true,
    sortable: true
  },
  {
    field: 'title',
    title: 'Title',
    filterable: true,
    sortable: true
  },
  {
    field: 'material',
    title: 'Material',
    filterable: true,
    sortable: true
  }
];

const Template: StoryFn<typeof ChooseXTableDialog<TestData>> = args => <ChooseXTableDialog {...args} />;

export const Single = Template.bind({});
Single.args = {
  open: true,
  title: 'Title',
  data: testDataForTables,
  cols,
  single: true
};

export const Multiple = Template.bind({});
Multiple.args = {
  open: true,
  title: 'Title',
  data: testDataForTables,
  cols
};
