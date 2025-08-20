/* eslint-disable sonarjs/no-duplicate-string */
import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { Template } from '../../Filter/XTable-Filter-story-template';
import { XTable, XTableProps } from '../../XTable';
import { XTableColumn } from '../../XTable.models';

interface TestData {
  id: number;
  owner: string;
}

export default {
  title: 'XTable/CellContent',
  component: XTable
};

const testDataForTextOverflowInTables: TestData[] = [
  {
    id: 2,
    owner: 'owner1'
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Владелец',
    type: PropertyType.CHOICE,
    field: 'owner',
    settings: {
      options: [
        {
          title:
            'Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества Принят на учет как бесхозяйный объект недвижимого имущества v Принят на учет как бесхозяйный объект недвижимого имущества',
          value: 'owner1'
        }
      ]
    }
  }
];

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeChoiceOverflow = Template.bind({}) as StoryFn<XTableForTestData>;
TypeChoiceOverflow.args = {
  data: testDataForTextOverflowInTables,
  cols
};
