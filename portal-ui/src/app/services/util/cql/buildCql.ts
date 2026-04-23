import { type FilterQuery, type FilterQueryValue } from '../filters/filters.models';
import { isArray } from '../typeGuards/isArray';

export function buildCql(query: FilterQuery = {}): string {
  return Object.entries(query)
    .map(([key, val]) => {
      if (topLevelOperators[key]) {
        return topLevelOperators[key](val as FilterQuery[]);
      }

      if (['string', 'number', 'boolean'].includes(typeof val) || val === null) {
        return `(${operators.$eq(key, val as string | number | boolean)})`;
      }

      return `(${Object.entries(val)
        .map(([subKey, subValue]) => {
          return operators[subKey](key, subValue as FilterQueryValue);
        })
        .join(' AND ')})`;
    })
    .join(' AND ');
}

function quoteStrings(value: unknown): unknown {
  return typeof value === 'string' ? `'${String(value)}'` : value;
}

function joinCqlListSegments(valuesQuoted: unknown[]): string {
  return valuesQuoted
    .filter((val): val is Exclude<unknown, null> => val !== null)
    .map(val => {
      if (typeof val === 'string') {
        return val;
      }
      if (typeof val === 'number' || typeof val === 'boolean') {
        return String(val);
      }

      return '';
    })
    .filter(Boolean)
    .join(',');
}

const operators: Record<string, (key: string, value: FilterQueryValue | FilterQuery) => string> = {
  $eq: (key: string, value: FilterQueryValue | FilterQuery) =>
    value === null ? `${key} IS null` : `${key} = ${String(quoteStrings(value))}`,
  $ne: (key: string, value: FilterQueryValue | FilterQuery) =>
    value === null ? `NOT (${key} IS null)` : `${key} <> ${String(quoteStrings(value))}`,
  $like: (key: string, value: FilterQueryValue | FilterQuery) => {
    if (typeof value !== 'string') {
      throw new TypeError('Invalid value for $like operator');
    }

    return `${key} LIKE '${value}'`;
  },
  $ilike: (key: string, value: FilterQueryValue | FilterQuery) => {
    if (typeof value !== 'string') {
      throw new TypeError('Invalid value for $ilike operator');
    }

    return `${key} ILIKE '${value}'`;
  },
  $in: (key: string, values: FilterQueryValue | FilterQuery) => {
    if (!isArray(values)) {
      throw new TypeError('Invalid value for $in operator');
    }

    const valuesQuoted = values.map(quoteStrings);

    return values.includes(null)
      ? `(${key} IN(${joinCqlListSegments(valuesQuoted)}) OR (${key} IS null))`
      : `${key} IN(${joinCqlListSegments(valuesQuoted)})`;
  },
  $nin: (key: string, values: FilterQueryValue | FilterQuery) => {
    if (!isArray(values)) {
      throw new TypeError('Invalid value for $nin operator');
    }

    const valuesQuoted = values.map(quoteStrings);

    if (values.includes(null)) {
      const valuesWithoutNullQuoted = valuesQuoted.filter(val => val !== null);
      const isNotNullFragment = `NOT (${key} IS null)`;

      if (!valuesWithoutNullQuoted.length) {
        return isNotNullFragment;
      }

      return `(${isNotNullFragment} AND NOT (${key} IN(${joinCqlListSegments(valuesWithoutNullQuoted)})))`;
    }

    return `NOT (${key} IN(${joinCqlListSegments(valuesQuoted)}))`;
  },
  $gt: (key: string, value: FilterQueryValue | FilterQuery) => `${key} > ${String(quoteStrings(value))}`,
  $lt: (key: string, value: FilterQueryValue | FilterQuery) => `${key} < ${String(quoteStrings(value))}`,
  $gte: (key: string, value: FilterQueryValue | FilterQuery) => `${key} >= ${String(quoteStrings(value))}`,
  $lte: (key: string, value: FilterQueryValue | FilterQuery) => `${key} <= ${String(quoteStrings(value))}`
};

const topLevelOperators: Record<string, (value: FilterQuery[] | FilterQuery) => string> = {
  $and: (value: FilterQuery[] | FilterQuery) => {
    if (!isArray(value)) {
      throw new TypeError('Invalid value for $and operator');
    }

    return `(${value.map(buildCql).join(') AND (')})`;
  },
  $or: (value: FilterQuery[] | FilterQuery) => {
    if (!isArray(value)) {
      throw new TypeError('Invalid value for $or operator');
    }

    return `(${value.map(buildCql).join(') OR (')})`;
  },
  $not: (value: FilterQuery[] | FilterQuery) => {
    if (isArray(value)) {
      throw new TypeError('Invalid value for $not operator');
    }

    return `(NOT (${buildCql(value)}))`;
  }
};
