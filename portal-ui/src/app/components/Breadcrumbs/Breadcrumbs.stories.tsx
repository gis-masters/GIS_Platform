import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HomeOutlined } from '@mui/icons-material';

import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbsItemData } from './Item/Breadcrumbs-Item';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = args => <Breadcrumbs {...args} />;

export const Regular = Template.bind({});

Regular.args = {
  itemsType: 'link',
  items: breadcrumbsItems()
};

export const MaxWidth500Breadcrumbs = Template.bind({});

MaxWidth500Breadcrumbs.args = {
  itemsType: 'link',
  items: breadcrumbsItems(),
  maxWidth: 500
};

export const MaxWidth250Breadcrumbs = Template.bind({});

MaxWidth250Breadcrumbs.args = {
  itemsType: 'link',
  items: breadcrumbsItems(),
  maxWidth: 400
};

export const MaxWidth100Breadcrumbs = Template.bind({});

MaxWidth100Breadcrumbs.args = {
  itemsType: 'link',
  items: breadcrumbsItems(),
  maxWidth: 100
};

function breadcrumbsItems(): BreadcrumbsItemData[] {
  const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
  const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);
  const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', 'dl_default_3', 'empty', 'empty']);
  const folderPath = JSON.stringify([
    ...libraryRootUrlItems,
    'library',
    'dl_default',
    'folder',
    '444',
    'empty',
    'empty'
  ]);
  const docPath = JSON.stringify([
    ...libraryRootUrlItems,
    'library',
    'dl_default',
    'folder',
    '444',
    'doc',
    '8888',
    'empty',
    'empty'
  ]);

  return [
    { title: <HomeOutlined />, url: '/data-management' },
    {
      title: 'Библиотеки документов',
      url: `/data-management?path_dm=${libraryRootPath}`
    },
    {
      title: 'Документы территориального планирования муниципальных образований',
      url: `/data-management?path_dm=${libraryPath}`
    },
    {
      title: 'Длинное название папки №444',
      url: `/data-management?path_dm=${folderPath}`
    },
    {
      title: 'Длинное название документа №8888',
      url: `/data-management?path_dm=${docPath}`
    }
  ];
}
