import { WfsGeometry } from '../wfs/wfs.models';

export interface StyleRule {
  name: string;
  title: string;
  legend: string;
  filter: StyleFilter;
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
