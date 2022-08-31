import { FilterQuery, FilterQueryValue } from './filterObjects';

export function buildCqlFilter(query: FilterQuery = {}): string {
  return Object.entries(query)
    .map(([key, val]) => {
      if (topLevelOperators[key]) {
        return topLevelOperators[key](val as FilterQuery[]);
      }

      if (['string', 'number', 'boolean'].includes(typeof val) || val === null) {
        return operators.$eq(key, val as string | number | boolean);
      }

      return `(${Object.entries(val)
        .map(([subKey, subValue]) => {
          return operators[subKey](key, subValue as FilterQueryValue);
        })
        .join(' AND ')})`;
    })
    .join(' AND ');
}

const operators: Record<string, (key: string, value: FilterQueryValue | FilterQuery) => string> = {
  $eq: (key: string, value: string | number | boolean) =>
    value === null ? `${key} IS null` : `${key} = '${String(value)}'`,
  $ne: (key: string, value: string | number | boolean) =>
    value === null ? `${key} IS NOT null` : `${key} <> '${String(value)}'`,
  $like: (key: string, value: string) => `${key} LIKE '${value}'`,
  $ilike: (key: string, value: string) => `${key} ILIKE '${value}'`,
  $in: (key: string, values: (string | number)[]) => {
    const valuesQuoted = values.map(val => (typeof val === 'string' ? `'${val}'` : val));

    return values.includes(null)
      ? `(${key} IN(${valuesQuoted.filter(val => val !== null).join(',')}) OR ${key} IS null)`
      : `${key} IN(${valuesQuoted.join(',')})`;
  },
  $nin: (key: string, values: (string | number)[]) => {
    const valuesQuoted = values.map(val => (typeof val === 'string' ? `'${val}'` : val));

    if (values.includes(null)) {
      const valuesWithoutNullQuoted = valuesQuoted.filter(val => val !== null);
      const isNotNullFragment = `${key} IS NOT null`;

      if (!valuesWithoutNullQuoted.length) {
        return isNotNullFragment;
      }

      return `(${isNotNullFragment} AND NOT(${key} IN(${valuesWithoutNullQuoted.join(',')})))`;
    }

    return `NOT (${key} IN(${valuesQuoted.join(',')}))`;
  },
  $gt: (key: string, value: string | number) => `${key} > '${value}'`,
  $lt: (key: string, value: string | number) => `${key} < '${value}'`,
  $gte: (key: string, value: string | number) => `${key} >= '${value}'`,
  $lte: (key: string, value: string | number) => `${key} <= '${value}'`
};

const topLevelOperators: Record<string, (value: FilterQuery[]) => string> = {
  $and: (value: FilterQuery[]) => `(${value.map(buildCqlFilter).join(') AND (')})`,
  $or: (value: FilterQuery[]) => `(${value.map(buildCqlFilter).join(') OR (')})`
};
