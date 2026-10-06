import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { type StoryFn } from '@storybook/react';

import { PropertyType } from '../../services/data/schema/schema.models';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';
import { testDataForTables } from '../XTable/testDataForTables';
import { type TestData } from '../XTable/testDataForTables';
import { type XTableColumn } from '../XTable/XTable.models';
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

function toastSelected(items: TestData[]): void {
  Toast.success(
    JSON.stringify(
      items.map(({ id, title }) => ({ id, title })),
      null,
      2
    )
  );
}

const Template: StoryFn<typeof ChooseXTableDialog<TestData>> = args => (
  <ChooseXTableDialog {...args} onSelect={toastSelected} />
);

function disabledTester(item: TestData): boolean | string {
  return item.id === 1 || item.id === 2 ? 'Недоступно' : false;
}

type ChooseXTableStoryRow = TestData & {
  unavailable?: boolean;
};

function storyRowDisabledTester(item: ChooseXTableStoryRow): boolean | string {
  return item.unavailable ? 'Недоступно' : false;
}

function keepStoryOpen(): void {
  // сторис остаётся открытой
}

const selectedTaburet = testDataForTables[2];
const selectedTaburetItems = [selectedTaburet];

type WithRowBecomingDisabledState = {
  data: ChooseXTableStoryRow[];
  makeTaburetUnavailable(): void;
};

const WithRowBecomingDisabledStory: FC = observer(() => {
  const state = useLocalObservable<WithRowBecomingDisabledState>(() => ({
    data: testDataForTables.map(item => ({ ...item, unavailable: false })),
    makeTaburetUnavailable() {
      const item = this.data.find(row => row.id === selectedTaburet.id);
      if (item) {
        item.unavailable = true;
      }
    }
  }));

  const handleMakeUnavailable = useCallback(() => {
    state.makeTaburetUnavailable();
  }, [state]);

  return (
    <ChooseXTableDialog<ChooseXTableStoryRow>
      open
      title='Title'
      data={state.data}
      cols={cols}
      disabledTester={storyRowDisabledTester}
      selectedItems={selectedTaburetItems}
      onClose={keepStoryOpen}
      onSelect={toastSelected}
      additionalAction={<Button onClick={handleMakeUnavailable}>Сделать Табурет недоступным</Button>}
    />
  );
});

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

export const WithSelectedItems = Template.bind({});
WithSelectedItems.args = {
  open: true,
  title: 'Title',
  data: testDataForTables,
  cols,
  selectedItems: [testDataForTables[0], testDataForTables[1]]
};

export const WithDisabledItems = Template.bind({});
WithDisabledItems.args = {
  open: true,
  title: 'Title',
  data: testDataForTables,
  cols,
  disabledTester,
  selectedItems: [testDataForTables[2], testDataForTables[0]]
};

export const SingleWithDisabledItems = Template.bind({});
SingleWithDisabledItems.args = {
  open: true,
  title: 'Title',
  data: testDataForTables,
  cols,
  single: true,
  disabledTester
};

const WithRowBecomingDisabledTemplate: StoryFn = () => <WithRowBecomingDisabledStory />;

export const WithRowBecomingDisabled = WithRowBecomingDisabledTemplate.bind({});
