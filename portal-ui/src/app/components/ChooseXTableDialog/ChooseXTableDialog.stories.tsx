import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ChooseXTableDialog } from './ChooseXTableDialog';
import { PropertyType } from '../../services/data/schema/schema.models';
import { TestData, testDataForTables } from '../XTable/XTable.stories';
import { XTableColumn } from '../XTable/XTable.models';

export default {
  title: 'ChooseXTableDialog',
  component: ChooseXTableDialog
} as ComponentMeta<typeof ChooseXTableDialog>;

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

const Template: ComponentStory<typeof ChooseXTableDialog<TestData>> = args => <ChooseXTableDialog {...args} />;

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
