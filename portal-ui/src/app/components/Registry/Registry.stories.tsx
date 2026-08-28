import React from 'react';
import { type Meta, type StoryFn } from '@storybook/react';

import { BuiltInRole } from '../../services/permissions/permissions.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { LibraryRegistry } from '../LibraryRegistry/LibraryRegistry';

import './Registry.stories.scss';

export default {
  title: 'Registry',
  component: LibraryRegistry,
  argTypes: {
    urlChangeEnabled: { control: 'boolean' }
  }
} as Meta<typeof LibraryRegistry>;

const Template: StoryFn<typeof LibraryRegistry> = args => {
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
    <div className='RegistryStory'>
      <LibraryRegistry {...args} />
    </div>
  );
};

export const Regular = Template.bind({});
Regular.args = {
  id: 'registryPage',
  libraryTableName: 'dl_data_section3',
  urlChangeEnabled: true
};
