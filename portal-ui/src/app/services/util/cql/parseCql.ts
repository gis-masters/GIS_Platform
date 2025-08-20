import And from 'ol/format/filter/And';
import EqualTo from 'ol/format/filter/EqualTo';
import Filter from 'ol/format/filter/Filter';
import GreaterThan from 'ol/format/filter/GreaterThan';
import GreaterThanOrEqualTo from 'ol/format/filter/GreaterThanOrEqualTo';
import IsLike from 'ol/format/filter/IsLike';
import IsNull from 'ol/format/filter/IsNull';
import LessThan from 'ol/format/filter/LessThan';
import LessThanOrEqualTo from 'ol/format/filter/LessThanOrEqualTo';
import Not from 'ol/format/filter/Not';
import NotEqualTo from 'ol/format/filter/NotEqualTo';
import Or from 'ol/format/filter/Or';

import { FilterQuery } from '../filters/filters.models';
import { cql2ol } from './cql2ol';

type Operator = (olFilter: Filter) => FilterQuery;

const operators: Record<string, Operator> = {
  And(olFilter: Filter) {
    if (!(olFilter instanceof And)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось And, получено ${olFilter.getTagName()}`);
    }

    return { $and: olFilter.conditions.map(parseOlFilter) };
  },

  Or(olFilter: Filter) {
    if (!(olFilter instanceof Or)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось Or, получено ${olFilter.getTagName()}`);
    }

    return { $or: olFilter.conditions.map(parseOlFilter) };
  },

  Not(olFilter: Filter) {
    if (!(olFilter instanceof Not)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось Not, получено ${olFilter.getTagName()}`);
    }

    return { $not: parseOlFilter(olFilter.condition) };
  },

  PropertyIsEqualTo(olFilter: Filter) {
    if (!(olFilter instanceof EqualTo)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось EqualTo, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: olFilter.expression };
  },

  PropertyIsNotEqualTo(olFilter: Filter) {
    if (!(olFilter instanceof NotEqualTo)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось NotEqualTo, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: { $ne: olFilter.expression } };
  },

  PropertyIsLike(olFilter: Filter) {
    if (!(olFilter instanceof IsLike)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось IsLike, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: { [olFilter.matchCase ? '$like' : '$ilike']: olFilter.pattern } };
  },

  PropertyIsGreaterThan(olFilter: Filter) {
    if (!(olFilter instanceof GreaterThan)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось GreaterThan, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: { $gt: olFilter.expression } };
  },

  PropertyIsLessThan(olFilter: Filter) {
    if (!(olFilter instanceof LessThan)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось LessThan, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: { $lt: olFilter.expression } };
  },

  PropertyIsGreaterThanOrEqualTo(olFilter: Filter) {
    if (!(olFilter instanceof GreaterThanOrEqualTo)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось GreaterThanOrEqualTo, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: { $gte: olFilter.expression } };
  },

  PropertyIsLessThanOrEqualTo(olFilter: Filter) {
    if (!(olFilter instanceof LessThanOrEqualTo)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось LessThanOrEqualTo, получено ${olFilter.getTagName()}`);
    }

    return { [olFilter.propertyName]: { $lte: olFilter.expression } };
  },

  PropertyIsNull(olFilter: Filter) {
    if (!(olFilter instanceof IsNull)) {
      throw new TypeError(`Ошибка чтения CQL: ожидалось IsNull, получено ${olFilter.getTagName()}`);
    }

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

export function parseCql(cql: string): FilterQuery {
  return parseOlFilter(cql2ol(cql));
}
