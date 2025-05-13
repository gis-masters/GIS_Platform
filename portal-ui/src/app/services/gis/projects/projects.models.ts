import { Role } from '../../permissions/permissions.models';
import { CrgLayer, CrgLayersGroup } from '../layers/layers.models';

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
