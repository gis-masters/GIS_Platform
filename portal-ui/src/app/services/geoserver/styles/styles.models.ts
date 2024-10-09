import { isObject } from 'lodash';

import { PropertySchema, PropertyType } from '../../data/schema/schema.models';
import { WfsGeometry } from '../wfs/wfs.models';

export interface StyleRuleExtended extends StyleRule {
  layerId: number;
  layerTitle: string;
}

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
  markColor: string;
  markSize: number;
  markType: 'circle' | 'square' | 'triangle' | 'star';
  strokeColor: string;
  strokeWidth: number;
  labelProperty?: PropertySchema;
}

export interface LineRule {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray?: number[];
  labelProperty?: PropertySchema;
}

export type FillGraphicType = 'oarrow' | 'slash' | 'backslash' | 'times' | 'horline' | 'vertline' | 'plus';

export interface PolygonRule {
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray?: number[];
  fillColor: string;
  labelProperty?: PropertySchema;
  fillGraphic?: {
    type: FillGraphicType;
    strokeWidth: number;
    size: number;
  };
}

interface BaseCustomStyleDescription {
  type: 'point' | 'line' | 'polygon' | 'all';
  rule: PointRule | LineRule | PolygonRule | (PointRule | LineRule | PolygonRule)[];
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

interface CustomStyleAllDescription extends BaseCustomStyleDescription {
  type: 'all';
  rule: [PointRule, LineRule, PolygonRule];
}

export type CustomStyleDescription =
  | CustomStyleLineDescription
  | CustomStylePointDescription
  | CustomStylePolygonDescription
  | CustomStyleAllDescription;

export interface StyleGeoserverInfo {
  name: string;
  href: string;
}

export const CUSTOM_STYLE_NAME = '__custom__';

export const customStyleStrokeColors: string[] = [
  '#51a7f9',
  '#6fc040',
  '#f5d427',
  '#f3901d',
  '#ed5c57',
  '#b36ae2',

  '#0c64c0',
  '#0c882a',
  '#dcbe22',
  '#de6a19',
  '#c82613',
  '#763e9b',

  '#174e86',
  '#0f5c1a',
  '#c3971d',
  '#be5b17',
  '#861106',
  '#5e327c',

  '#002451',
  '#06400c',
  '#a37519',
  '#934511',
  '#570606',
  '#3b204d',

  '#cccccc',
  '#aaaaaa',
  '#888888',
  '#666666',
  '#333333',
  '#000000'
];

export const transparent = '#ffffffff';

export const customStyleFillColors: string[] = [
  '#80ffff',
  '#00ff00',
  '#ffff00',
  '#ff8000',
  '#ff0000',
  '#ff00ff',

  '#a0a0ff',
  '#80ff80',
  '#ffff80',
  '#ffc080',
  '#ff8080',
  '#ff80ff',

  '#6666ff',
  '#cccccc',
  '#999999',
  '#666666',
  '#333333',
  '#000000',
  transparent
];

export const customStyleStrokes: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>[] = [
  { strokeWidth: 1 },
  { strokeWidth: 1, strokeDashArray: [2, 2] },
  { strokeWidth: 1, strokeDashArray: [4, 2] },
  { strokeWidth: 1, strokeDashArray: [4, 2, 2, 2] },

  { strokeWidth: 2 },
  { strokeWidth: 2, strokeDashArray: [2, 2] },
  { strokeWidth: 2, strokeDashArray: [6, 2] },
  { strokeWidth: 2, strokeDashArray: [6, 2, 2, 2] },

  { strokeWidth: 4 },
  { strokeWidth: 4, strokeDashArray: [4, 4] },
  { strokeWidth: 4, strokeDashArray: [12, 4] },
  { strokeWidth: 4, strokeDashArray: [12, 4, 4, 4] },

  { strokeWidth: 6 },
  { strokeWidth: 6, strokeDashArray: [6, 6] },
  { strokeWidth: 6, strokeDashArray: [18, 6] },
  { strokeWidth: 6, strokeDashArray: [18, 6, 6, 6] },

  { strokeWidth: 8 },
  { strokeWidth: 8, strokeDashArray: [8, 8] },
  { strokeWidth: 8, strokeDashArray: [24, 8] },
  { strokeWidth: 8, strokeDashArray: [24, 8, 8, 8] }
];

export const customStyleHatches: PolygonRule['fillGraphic'][] = [
  { strokeWidth: 1, size: 3, type: 'slash' },
  { strokeWidth: 1, size: 3, type: 'backslash' },
  { strokeWidth: 1, size: 4, type: 'times' },
  { strokeWidth: 1, size: 3, type: 'horline' },
  { strokeWidth: 1, size: 3, type: 'vertline' },
  { strokeWidth: 1, size: 3, type: 'plus' },

  { strokeWidth: 2, size: 6, type: 'slash' },
  { strokeWidth: 2, size: 6, type: 'backslash' },
  { strokeWidth: 2, size: 8, type: 'times' },
  { strokeWidth: 2, size: 5, type: 'horline' },
  { strokeWidth: 2, size: 5, type: 'vertline' },
  { strokeWidth: 2, size: 5, type: 'plus' },

  { strokeWidth: 3, size: 9, type: 'slash' },
  { strokeWidth: 3, size: 9, type: 'backslash' },
  { strokeWidth: 3, size: 12, type: 'times' },
  { strokeWidth: 3, size: 7, type: 'horline' },
  { strokeWidth: 3, size: 7, type: 'vertline' },
  { strokeWidth: 3, size: 7, type: 'plus' },

  { strokeWidth: 4, size: 12, type: 'slash' },
  { strokeWidth: 4, size: 12, type: 'backslash' },
  { strokeWidth: 4, size: 16, type: 'times' },
  { strokeWidth: 4, size: 9, type: 'horline' },
  { strokeWidth: 4, size: 9, type: 'vertline' },
  { strokeWidth: 4, size: 9, type: 'plus' },

  { strokeWidth: 5, size: 15, type: 'slash' },
  { strokeWidth: 5, size: 15, type: 'backslash' },
  { strokeWidth: 5, size: 20, type: 'times' },
  { strokeWidth: 5, size: 12, type: 'horline' },
  { strokeWidth: 5, size: 12, type: 'vertline' },
  { strokeWidth: 5, size: 12, type: 'plus' },
  undefined
];

export const customStyleMarks: Pick<PointRule, 'markSize' | 'markType'>[] = [
  { markSize: 10, markType: 'circle' },
  { markSize: 10, markType: 'square' },
  { markSize: 10, markType: 'triangle' },
  { markSize: 10, markType: 'star' },

  { markSize: 20, markType: 'circle' },
  { markSize: 20, markType: 'square' },
  { markSize: 20, markType: 'triangle' },
  { markSize: 20, markType: 'star' },

  { markSize: 30, markType: 'circle' },
  { markSize: 30, markType: 'square' },
  { markSize: 30, markType: 'triangle' },
  { markSize: 30, markType: 'star' },

  { markSize: 40, markType: 'circle' },
  { markSize: 40, markType: 'square' },
  { markSize: 40, markType: 'triangle' },
  { markSize: 40, markType: 'star' }
];

export const LABEL_PROPERTY_DEFAULT: PropertySchema = {
  name: 'без подписи',
  title: 'без подписи',
  propertyType: PropertyType.STRING
};

export function isStyleRuleExtended(obj: unknown): obj is StyleRuleExtended {
  return (
    isObject(obj) &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'legend' in obj &&
    typeof obj.legend === 'string' &&
    'layerId' in obj &&
    typeof obj.layerId === 'number' &&
    'layerTitle' in obj &&
    typeof obj.layerTitle === 'string'
  );
}
