/* eslint-disable sonarjs/no-duplicate-string */
import { ReactElement } from 'react';
import { StoryFn } from '@storybook/react';

import { FiasValue } from '../../../../services/data/fias/fias.models';
import { PropertyType } from '../../../../services/data/schema/schema.models';
import { Template } from '../../Filter/XTable-Filter-story-template';
import { XTable, XTableProps } from '../../XTable';
import { XTableColumn } from '../../XTable.models';

interface TestData {
  id: number;
  value: FiasValue;
}

export default {
  title: 'XTable/CellContent',
  component: XTable
};

const testDataForTextOverflowInTables: TestData[] = [
  {
    id: 2,
    value: {
      address: 'Респ Крым, г.о. Алушта, г Алушта, ул Западная, д.12',
      id: 53_865_363,
      oktmo: '35703000001'
    }
  }
];

const cols: XTableColumn<TestData>[] = [
  {
    title: 'Адрес',
    type: PropertyType.FIAS,
    field: 'value'
  }
];

type XTableForTestData = (p: XTableProps<TestData>) => ReactElement;

export const TypeFiasOverflow = Template.bind({}) as StoryFn<XTableForTestData>;
TypeFiasOverflow.args = {
  data: testDataForTextOverflowInTables,
  cols
};
