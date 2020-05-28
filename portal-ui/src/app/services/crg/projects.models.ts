import { SupportedGeometryType } from '../geoserver/wfs-models';
import { CrgProjectBaseMap } from './base-maps.models';
import { UserPermission } from '../util/permissions';
import { FeatureDescription } from './schema.service';

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
  maxZoom: number;
  minZoom: number;
  styleName: string;
  nativeCRS: string;
  schemaId: string;
  complexName: string;
  groupId?: number;
}

// extended on ui
export interface CrgLayer extends BaseCrgLayer {
  geometryType?: SupportedGeometryType;
  schema?: FeatureDescription;
  legend?: RuleWithLegend[];
  legendIsFetching?: boolean;
  sourceData?: CrgSource;
}

export interface CrgSource {
  name: string;
  permission: UserPermission;
  valid: boolean;
}

export interface CrgGroup extends CrgEntity {
  parent?: number;
  expanded: boolean;
}

export interface TreeItem<T = (CrgLayer | CrgGroup)> {
  id: number;
  payload: T;
  isGroup: boolean;
  depth?: number;
  visible?: boolean;
  parent?: TreeItem<CrgGroup>;
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
  groups: CrgGroup[];
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
