import { Role } from '../data/permissions.models';

export enum CrgLayerType {
  VECTOR = 'vector',
  VECTOR_FROM_FILE = 'vectorFromFile',
  RASTER = 'raster',
  EXTERNAL = 'external',
  EXTERNAL_GEOSERVER = 'external_geoserver'
}

export type FilePlacementMode = 'full' | 'geoserver' | 'gis-service';

interface CrgEntity {
  title: string;
  id?: number;
  enabled?: boolean;
  position?: number;
  transparency?: number;
}

export interface CrgLayersGroup extends CrgEntity {
  expanded?: boolean;
  parentId?: number;
}

export interface CrgRasterLayer extends CrgBaseLayer {
  type: CrgLayerType.RASTER;
  mode: FilePlacementMode;
  dataStoreName?: string;
  dataSourceUri?: string;
  libraryId: string;
  recordId: number;
  parentId?: number;
  enabled?: boolean;
}

export interface CrgVectorLayer extends CrgBaseLayer {
  type: CrgLayerType.VECTOR;
  dataStoreName?: string;
  schemaId?: string;
  styleName?: string;
  dataset?: string;
  view?: string;
}

export interface CrgExternalLayer extends CrgBaseLayer {
  type: CrgLayerType.EXTERNAL | CrgLayerType.EXTERNAL_GEOSERVER;
  dataSourceUri: string;
}

export type CrgLayer = Partial<
  Omit<CrgRasterLayer, 'type'> & Omit<CrgVectorLayer, 'type'> & Omit<CrgExternalLayer, 'type'> & CrgBaseLayer
>;

interface CrgBaseLayer extends CrgEntity {
  type: CrgLayerType;
  nativeCRS: string;
  tableName: string;
  minZoom?: number;
  maxZoom?: number;
  complexName?: string;
  parentId?: number;
}

export type NewCrgLayer = Partial<CrgLayer>;

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
}
