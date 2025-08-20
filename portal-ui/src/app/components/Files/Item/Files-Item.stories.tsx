import React from 'react';
import { StoryFn } from '@storybook/react';

import { Role } from '../../../services/permissions/permissions.models';
import { FilesItem } from './Files-Item';

export default {
  title: 'Files-Item',
  component: FilesItem
};

const Template: StoryFn<typeof FilesItem> = args => <FilesItem {...args} />;

export const Signature = Template.bind({});
Signature.args = {
  item: {
    id: 'c7af9fca-9552-460e-aea5-00095d04109a',
    title: '315.dxf',
    size: 9_121_527,
    signed: true
  },
  showPlaceAction: true,
  document: {
    role: Role.OWNER,
    is_folder: false,
    some_files: [
      {
        id: '79007194-8e49-474c-80ee-f5ab0a2eef3a',
        title: '111.xml',
        size: 9779
      },
      {
        id: 'c7af9fca-9552-460e-aea5-00095d04109a',
        title: '315.dxf',
        size: 9_121_527
      }
    ],
    content_type_id: 'doc_v4',
    created_at: '2024-09-12 13:59:22',
    title: '123',
    created_by: 'arh_grad_rk@mail.ru',
    path: '/root',
    is_deleted: false,
    id: 1,
    last_modified: '2024-09-12 13:59:22',
    libraryTableName: 'dl_default',
    schemaId: 'dl_default_schema'
  },
  numerous: true,
  multiple: true
};
