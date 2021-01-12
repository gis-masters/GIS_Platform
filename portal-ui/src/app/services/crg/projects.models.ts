import { SupportedGeometryType } from '../geoserver/wfs.models';
import { CrgProjectBaseMap } from './base-maps.models';
import { Role } from './permissions.models';

export enum CrgLayerType {
  VECTOR = 'vector',
  RASTER = 'raster',
  EXTERNAL = 'external'
}

interface CrgEntity {
  id: number;
  title: string;
  enabled: boolean;
  position: number;
  transparency: number;
}

// layer from api
interface BaseCrgLayer extends CrgEntity {
  dataset: string;
  internalName: string;
  type: CrgLayerType;
  maxZoom: number;
  minZoom: number;
  styleName: string;
  nativeCRS: string;
  schemaId: string;
  complexName: string;
  dataSourceUri: string;
  groupId?: number;
}

// extended on ui
//FIXME: не должно быть расширения на UI, может перенести эти св-ва в TreeItem?
export interface CrgLayer extends BaseCrgLayer {
  geometryType?: SupportedGeometryType;
  legend?: RuleWithLegend[];
  legendIsFetching?: boolean;
}

export interface CrgLayersGroup extends CrgEntity {
  parent?: number;
  expanded: boolean;
}

export type NewCrgLayersGroup = Pick<
  CrgLayersGroup,
  'id' | 'title' | 'enabled' | 'transparency' | 'position' | 'parent' | 'expanded'
>;

export type TreeItemPayload = CrgLayer | CrgLayersGroup | NewCrgLayersGroup;

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
  baseMaps: CrgProjectBaseMap[];
  layersCount: number;
}

export interface Rule {
  name: string;
  title: string;
}

export interface RuleWithLegend extends Rule {
  legend: string;
}
