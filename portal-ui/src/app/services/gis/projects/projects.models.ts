import { createElement, Fragment } from 'react';

import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { PropertyType, type SimpleSchema } from '../../data/schema/schema.models';
import { type Role } from '../../permissions/permissions.models';
import { type CrgLayer, type CrgLayersGroup } from '../layers/layers.models';

export type TreeItemPayload = CrgLayer | CrgLayersGroup;

export interface TreeItem<T = TreeItemPayload> {
  id: number;
  payload: T;
  isGroup: boolean;
  isEmptyGroup?: boolean;
  depth?: number;
  visible?: boolean;
  hiddenByZoom?: boolean;
  parent?: TreeItem<CrgLayersGroup>;
  actualTransparency?: number;
  errors?: string[];
}

export interface CrgProject {
  id: number;
  name: string;
  description?: string;
  bbox?: string;
  default?: boolean;
  order?: number;
  organizationId?: number;
  createdAt?: string;
  role: Role;
  path?: string;
  parentId?: number;
  folder: boolean;
}

export type NewCrgProject = Pick<CrgProject, 'name' | 'description' | 'bbox' | 'folder' | 'parentId'>;

export const crgProjectFolderSchema: SimpleSchema = {
  properties: [
    {
      name: 'name',
      title: 'Название',
      required: true,
      propertyType: PropertyType.STRING
    },
    {
      name: 'description',
      title: 'Описание',
      propertyType: PropertyType.STRING
    }
  ]
};

export const crgProjectSchema: SimpleSchema = {
  properties: [
    ...crgProjectFolderSchema.properties,
    {
      name: 'bbox',
      title: 'Bbox',
      required: true,
      defaultValueFormula: () => organizationSettings.defaultProjectBbox,
      validationWellKnownFormula: 'bboxJson3857',
      description: createElement(
        Fragment,
        null,
        'BBox (bounding box) для картографического слоя в метрах — это прямоугольная область, которая определяет границы проекта на карте. Она указывается в метрах и содержит координаты минимального и максимального значений по осям X и Y.',
        createElement('br'),
        'Пример заполнения:',
        createElement('br'),
        '[4336548,5630738,4337222,5632892]'
      ),
      propertyType: PropertyType.STRING
    }
  ]
};
