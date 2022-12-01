import Or from 'ol/format/filter/Or';
import And from 'ol/format/filter/And';
import Not from 'ol/format/filter/Not';
import IsNull from 'ol/format/filter/IsNull';
import IsLike from 'ol/format/filter/IsLike';
import Filter from 'ol/format/filter/Filter';
import EqualTo from 'ol/format/filter/EqualTo';
import LessThan from 'ol/format/filter/LessThan';
import NotEqualTo from 'ol/format/filter/NotEqualTo';
import GreaterThan from 'ol/format/filter/GreaterThan';
import LessThanOrEqualTo from 'ol/format/filter/LessThanOrEqualTo';
import GreaterThanOrEqualTo from 'ol/format/filter/GreaterThanOrEqualTo';

import { cql2ol } from './cql2ol';
import { FilterQuery } from './filterObjects';

type Operator = (olFilter: Filter) => FilterQuery;

const operators: Record<string, Operator> = {
  And(olFilter: And) {
    return { $and: olFilter.conditions.map(parseOlFilter) };
  },

  Or(olFilter: Or) {
    return { $or: olFilter.conditions.map(parseOlFilter) };
  },

  Not(olFilter: Not) {
    return { $not: parseOlFilter(olFilter.condition) };
  },

  PropertyIsEqualTo(olFilter: EqualTo) {
    return { [olFilter.propertyName]: olFilter.expression };
  },

  PropertyIsNotEqualTo(olFilter: NotEqualTo) {
    return { [olFilter.propertyName]: { $ne: olFilter.expression } };
  },

  PropertyIsLike(olFilter: IsLike) {
    return { [olFilter.propertyName]: { [olFilter.matchCase ? '$like' : '$ilike']: olFilter.pattern } };
  },

  PropertyIsGreaterThan(olFilter: GreaterThan) {
    return { [olFilter.propertyName]: { $gt: olFilter.expression } };
  },

  PropertyIsLessThan(olFilter: LessThan) {
    return { [olFilter.propertyName]: { $lt: olFilter.expression } };
  },

  PropertyIsGreaterThanOrEqualTo(olFilter: GreaterThanOrEqualTo) {
    return { [olFilter.propertyName]: { $gte: olFilter.expression } };
  },

  PropertyIsLessThanOrEqualTo(olFilter: LessThanOrEqualTo) {
    return { [olFilter.propertyName]: { $lte: olFilter.expression } };
  },

  PropertyIsNull(olFilter: IsNull) {
    return { [olFilter.propertyName]: null };
  }
};

function parseOlFilter(olFilter: Filter): FilterQuery {
  const operator = operators[olFilter.getTagName()];

  if (!operator) {
    throw new Error(`CQL parse error: unknown operator "${olFilter.getTagName()}"`);
  }

  return operator(olFilter);
}

export function cqlParse(cql: string): FilterQuery {
  return parseOlFilter(cql2ol(cql));
}
