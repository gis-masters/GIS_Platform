import React from 'react';
import { type Meta, type StoryFn } from '@storybook/react';

import { BuiltInRole } from '../../services/permissions/permissions.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { Toast } from '../Toast/Toast';
import { Explorer } from './Explorer';
import { type Adapter, type ExplorerItemData, ExplorerItemType } from './Explorer.models';

import './Explorer.stories.scss';

export default {
  title: 'Explorer',
  component: Explorer,
  argTypes: {
    withInfoPanel: { control: 'boolean' },
    fixedHeight: { control: 'boolean' },
    withoutTitle: { control: 'boolean' },
    hideToolbarActions: { control: 'boolean' },
    hideItemsSort: { control: 'boolean' },
    hidePageSize: { control: 'boolean' },
    urlChangeEnabled: { control: 'boolean' }
  }
} as Meta<typeof Explorer>;

const ROOT_CHILDREN: ExplorerItemData[] = [
  { type: ExplorerItemType.DATASET_ROOT, payload: null },
  { type: ExplorerItemType.PROJECTS_ROOT, payload: null },
  { type: ExplorerItemType.SCHEMA_TEMPLATES_ROOT, payload: null }
];

function notifyStorybookNavigationUnsupported(): void {
  Toast.info('Переход по страницам в библиотеке блоков не поддерживается');
}

const adaptersOverride: Record<string, Partial<Adapter>> = {
  [ExplorerItemType.ROOT]: {
    getChildren: () => [ROOT_CHILDREN, 1]
  },
  [ExplorerItemType.PROJECT]: {
    customOpenAction: notifyStorybookNavigationUnsupported
  },
  [ExplorerItemType.TABLE]: {
    customOpenAction: notifyStorybookNavigationUnsupported
  }
};

const Template: StoryFn<typeof Explorer> = args => {
  currentUser.setOrgInfo({
    id: 2,
    email: 'arh_grad_rk@mail.ru',
    name: 'РИСОГД',
    surname: 'РИСОГД',
    login: 'arh_grad_rk@mail.ru',
    geoserverLogin: 'arh_grad_rk@mail.ru',
    enabled: true,
    authorities: [BuiltInRole.ORG_ADMIN],
    createdAt: '2020-02-10T06:44:14.08',
    orgName: 'Hogwarts 1',
    orgId: 1
  });

  return (
    <div className='ExplorerStory'>
      <Explorer {...args} adaptersOverride={adaptersOverride} />
    </div>
  );
};

export const Regular = Template.bind({});
Regular.args = {
  preset: ExplorerItemType.ROOT,
  explorerRole: 'dm',
  withInfoPanel: true,
  fixedHeight: true,
  urlChangeEnabled: true
};
