import { CrgProjectBaseMap } from './base-maps.models';

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
  schemaId: string;
  groupId?: number;
}

// extended on ui
export interface CrgLayer extends BaseCrgLayer {
  complexName?: string;
  href?: string;
  legend?: RuleWithLegend[];
  legendIsFetching?: boolean;
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
