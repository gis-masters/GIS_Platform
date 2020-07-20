import { SupportedGeometryType } from '../geoserver/wfs-models';
import { CrgProjectBaseMap } from './base-maps.models';
import { Role } from './permissions.service';

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
export interface CrgLayer extends BaseCrgLayer {
  geometryType?: SupportedGeometryType;
  legend?: RuleWithLegend[];
  legendIsFetching?: boolean;
  sourceData?: CrgSource;
}

export interface CrgSource {
  name: string;
  permission: Role;
  valid: boolean;
}

export interface CrgLayersGroup extends CrgEntity {
  parent?: number;
  expanded: boolean;
}

export interface TreeItem<T = CrgLayer | CrgLayersGroup> {
  id: number;
  payload: T;
  isGroup: boolean;
  depth?: number;
  visible?: boolean;
  parent?: TreeItem<CrgLayersGroup>;
  actualTransparency?: number;
}

export interface Project {
  id: number;
  name: string;
  internalName: string;
  bbox: string;
  default: boolean;
  order: number;
  organizationId: number;
  layers: CrgLayer[];
  groups: CrgLayersGroup[];
  createdAt: string;
  baseMaps: CrgProjectBaseMap[];
}

export interface Rule {
  name: string;
  title: string;
}

export interface RuleWithLegend extends Rule {
  legend: string;
}
