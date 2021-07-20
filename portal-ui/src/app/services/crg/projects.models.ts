import { SupportedGeometryType } from '../geoserver/wfs.models';
import { Role } from './permissions.models';

export enum CrgLayerType {
  VECTOR = 'vector',
  RASTER = 'raster',
  EXTERNAL = 'external'
}

interface CrgEntity {
  id?: number;
  title: string;
  enabled: boolean;
  position: number;
  transparency: number;
}

// layer from api
interface BaseCrgLayer extends CrgEntity {
  dataset: string;
  dataStoreName?: string;
  tableName: string;
  type: CrgLayerType;
  minZoom?: number;
  maxZoom?: number;
  styleName: string;
  nativeCRS: string;
  schemaId: string;
  complexName: string;
  dataSourceUri?: string;
  parentId?: number;
}

// extended on ui
//FIXME: не должно быть расширения на UI, может перенести эти св-ва в TreeItem?
export interface CrgLayer extends BaseCrgLayer {
  geometryType?: SupportedGeometryType;
  legend?: Rule[];
  legendIsFetching?: boolean;
}

export type NewCrgLayer = Pick<
  BaseCrgLayer,
  | 'id'
  | 'title'
  | 'dataStoreName'
  | 'dataset'
  | 'complexName'
  | 'tableName'
  | 'enabled'
  | 'parentId'
  | 'minZoom'
  | 'maxZoom'
  | 'nativeCRS'
  | 'transparency'
  | 'styleName'
  | 'position'
  | 'schemaId'
  | 'type'
>;

export interface CrgSource {
  role: Role;
  identifier: string;
  type: string;
}

export interface CrgLayersGroup extends CrgEntity {
  parentId?: number;
  expanded: boolean;
}

export type NewCrgLayersGroup = Pick<
  CrgLayersGroup,
  'id' | 'title' | 'enabled' | 'transparency' | 'position' | 'parentId' | 'expanded'
>;

export type TreeItemPayload = CrgLayer | NewCrgLayer | CrgLayersGroup | NewCrgLayersGroup;

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
  internalName: string;
  bbox: string;
  default: boolean;
  order: number;
  organizationId: number;
  createdAt: string;
}

export interface Rule {
  name: string;
  title: string;
  legend: string;
}
