import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { CrgLayer, CrgLayerType } from '../../services/gis/layers/layers.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { Role } from '../../services/permissions/permissions.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { LayersSidebar } from './LayersSidebar';

import '!style-loader!css-loader!sass-loader!./LayersSidebar.scss';

export default {
  title: 'LayersSidebar',
  component: LayersSidebar
} as Meta<typeof LayersSidebar>;

const PROJECT: CrgProject = {
  id: 2180,
  name: 'test',
  organizationId: 11,
  createdAt: '2024-10-23T15:11:53.421326',
  role: Role.OWNER,
  default: false
};

const ALLOWED_LAYERS: CrgLayer[] = [
  {
    id: 92_778,
    title: 'Конфликтные данные карты',
    type: CrgLayerType.VECTOR,
    dataset: 'dataset_645586',
    tableName: 'housing_stock_1561_64d1',
    enabled: true,
    position: 3,
    transparency: 75,
    maxZoom: 25,
    minZoom: 10,
    styleName: 'housing_stock',
    nativeCRS: 'EPSG:7828',
    parentId: 8611,
    complexName: 'scratch_database_11:housing_stock_1561_64d1__7828',
    dataStoreName: 'scratch_database_11',
    view: ''
  },
  {
    id: 92_779,
    title: 'АЗС',
    type: CrgLayerType.VECTOR,
    dataset: 'dataset_645587',
    tableName: 'housing_stock_1561_64d2',
    enabled: true,
    position: 4,
    transparency: 75,
    maxZoom: 25,
    minZoom: 10,
    styleName: 'housing_stock',
    nativeCRS: 'EPSG:7828',
    parentId: 8611,
    complexName: 'scratch_database_11:housing_stock_1561_64d2__7828',
    dataStoreName: 'scratch_database_11',
    view: ''
  }
];

const GROUPS = [
  {
    expanded: true,
    transparency: 100,
    title: 'замельные участки 2',
    position: -1,
    enabled: true,
    id: 8609
  },
  {
    expanded: false,
    transparency: 100,
    title: 'земельные участки',
    position: 1,
    enabled: true,
    id: 8610
  },
  {
    expanded: false,
    transparency: 100,
    title: 'слои зу',
    parentId: 8610,
    position: 2,
    enabled: true,
    id: 8611
  }
];

const LAYERS: CrgLayer[] = [
  {
    id: 92_778,
    title: 'Конфликтные данные карты',
    type: CrgLayerType.VECTOR,
    dataset: 'dataset_645586',
    tableName: 'housing_stock_1561_64d1',
    enabled: true,
    position: 3,
    transparency: 75,
    maxZoom: 25,
    minZoom: 10,
    styleName: 'housing_stock',
    nativeCRS: 'EPSG:7828',
    parentId: 8611,
    complexName: 'scratch_database_11:housing_stock_1561_64d1__7828',
    dataStoreName: 'scratch_database_11',
    view: ''
  },
  {
    id: 92_779,
    title: 'АЗС',
    type: CrgLayerType.VECTOR,
    dataset: 'dataset_645587',
    tableName: 'housing_stock_1561_64d2',
    enabled: true,
    position: 4,
    transparency: 75,
    maxZoom: 25,
    minZoom: 10,
    styleName: 'housing_stock',
    nativeCRS: 'EPSG:7828',
    parentId: 8611,
    complexName: 'scratch_database_11:housing_stock_1561_64d2__7828',
    dataStoreName: 'scratch_database_11',
    view: ''
  }
];

const Template: StoryFn<typeof LayersSidebar> = args => {
  // заполняем стор, т.к. сайдбар слоев берет информацию оттуда
  currentProject.setProject(PROJECT, ALLOWED_LAYERS, GROUPS, {}, LAYERS);

  return <LayersSidebar {...args} />;
};

export const Regular = Template.bind({});
Regular.args = {};
