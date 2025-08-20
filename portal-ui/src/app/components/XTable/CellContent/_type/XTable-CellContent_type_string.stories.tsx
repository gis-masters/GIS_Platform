/* eslint-disable sonarjs/no-duplicate-string */
import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { Template } from '../../Filter/XTable-Filter-story-template';
import { XTable, XTableProps } from '../../XTable';
import { XTableColumn } from '../../XTable.models';

interface TestData {
  id: number;
  title: string;
  description: string;
}

export default {
  title: 'XTable/CellContent',
  component: XTable
};

const testDataForTextOverflowInTables = [
  {
    id: 132,
    title: 'Колонка для тестирования',
    description:
      'Тестовое значение для компонента TextOverFlow Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi incidunt magni deleniti consequuntur quo voluptatem alias illo, quidem eos corrupti! At esse quaerat, quas beatae incidunt iusto perspiciatis quisquam odit.'
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Тестовая колонка',
    type: PropertyType.STRING,
    field: 'description'
  }
];

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeStringOverflow = Template.bind({}) as StoryFn<XTableForTestData>;
TypeStringOverflow.args = {
  data: testDataForTextOverflowInTables,
  cols
};
