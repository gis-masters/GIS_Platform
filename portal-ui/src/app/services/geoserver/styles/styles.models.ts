import { WfsGeometry } from '../wfs/wfs.models';

export interface StyleRule {
  name: string;
  title: string;
  legend: string;
  filter?: StyleFilter;
}

export interface FilteredStylesResponse {
  dataset: string;
  identifier: string;
  rules: string[];
}

export enum StyleFilterOperator {
  AND = 'And',
  OR = 'Or',
  NOT = 'Not',
  EQUAL_TO = 'PropertyIsEqualTo',
  NOT_EQUAL_TO = 'PropertyIsNotEqualTo',
  LESS_THAN = 'PropertyIsLessThan',
  LESS_THAN_OR_EQUAL_TO = 'PropertyIsLessThanOrEqualTo',
  GREATER_THEN = 'PropertyIsGreaterThan',
  GREATER_THEN_OR_EQUAL_TO = 'PropertyIsGreaterThanOrEqualTo',
  LIKE = 'PropertyIsLike',
  INTERSECTS = 'Intersects',
  ELSE = 'ElseFilter'
}

export type StyleFilter = StyleFilterLogical | StyleFilterComparison | StyleFilterSpatial | StyleFilterElse;

interface StyleFilterLogical {
  operator: StyleFilterOperator.AND | StyleFilterOperator.OR | StyleFilterOperator.NOT;
  filters: StyleFilter[];
}

interface StyleFilterComparison {
  operator:
    | StyleFilterOperator.EQUAL_TO
    | StyleFilterOperator.NOT_EQUAL_TO
    | StyleFilterOperator.LESS_THAN
    | StyleFilterOperator.LESS_THAN_OR_EQUAL_TO
    | StyleFilterOperator.GREATER_THEN
    | StyleFilterOperator.GREATER_THEN_OR_EQUAL_TO
    | StyleFilterOperator.LIKE;
  propertyName: string;
  literal: string | number;
  matchCase?: boolean;
}

interface StyleFilterSpatial {
  operator: StyleFilterOperator.INTERSECTS;
  propertyName?: string;
  literal: WfsGeometry;
}

interface StyleFilterElse {
  operator: StyleFilterOperator.ELSE;
}

export interface FilteredStylesLayerRequest {
  dataset: string;
  identifier: string;
  ecqlFilter?: string;
  filter: StyleFilter;
  rules: StyleRule[];
}

export interface PointRule {
  markColor?: string;
  markSize?: number;
  markType: 'circle' | 'square' | 'triangle' | 'star';
}

export interface LineRule {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray?: number[];
}

export type FillGraphicType = 'times';

export interface PolygonRule {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDashArray?: number[];
  fillColor?: string;
  fillGraphic?: {
    type: FillGraphicType;
    strokeColor?: string;
    strokeWidth?: number;
    size?: number;
    strokeDashArray?: number[];
  };
}

interface BaseCustomStyleDescription {
  type: 'point' | 'line' | 'polygon';
  rule: PointRule | LineRule | PolygonRule;
}

interface CustomStyleLineDescription extends BaseCustomStyleDescription {
  type: 'line';
  rule: LineRule;
}

interface CustomStylePointDescription extends BaseCustomStyleDescription {
  type: 'point';
  rule: PointRule;
}

interface CustomStylePolygonDescription extends BaseCustomStyleDescription {
  type: 'polygon';
  rule: PolygonRule;
}

export type CustomStyleDescription =
  | CustomStyleLineDescription
  | CustomStylePointDescription
  | CustomStylePolygonDescription;

export const CUSTOM_STYLE_NAME = '__custom__';

export interface StyleGeoserverInfo {
  name: string;
  href: string;
}
