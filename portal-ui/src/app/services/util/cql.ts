import { FilterQuery, FilterQueryValue } from './filterObjects';

export function buildCqlFilter(query: FilterQuery): string {
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
          return operators[subKey](key, subValue);
        })
        .join(' AND ')})`;
    })
    .join(' AND ');
}

const operators: Record<string, (key: string, value: FilterQueryValue | FilterQuery) => string> = {
  $eq: (key: string, value: string | number | boolean) =>
    value === null ? `"${key}" IS null` : `"${key}" = '${String(value)}'`,
  $ne: (key: string, value: string | number | boolean) =>
    value === null ? `"${key}" IS NOT null` : `"${key}" <> '${String(value)}'`,
  $like: (key: string, value: string) => `"${key}" LIKE '${value}'`,
  $ilike: (key: string, value: string) => `"${key}" ILIKE '${value}'`,
  $in: (key: string, value: string[]) =>
    value.includes(null)
      ? `("${key}" IN('${value.filter(val => val !== null).join("','")}') OR "${key}" IS null)`
      : `"${key}" IN('${value.join("','")}')`,
  $nin: (key: string, value: string[]) =>
    value.map(item => (item === null ? `"${key}" IS NOT null` : `("${key}" <> '${item}')`)).join(' AND '),
  $gt: (key: string, value: string | number) => `"${key}" > '${value}'`,
  $lt: (key: string, value: string | number) => `"${key}" < '${value}'`,
  $gte: (key: string, value: string | number) => `"${key}" >= '${value}'`,
  $lte: (key: string, value: string | number) => `"${key}" <= '${value}'`
};

const topLevelOperators: Record<string, (value: FilterQuery[]) => string> = {
  $and: (value: FilterQuery[]) => `(${value.map(buildCqlFilter).join(') AND (')})`,
  $or: (value: FilterQuery[]) => `(${value.map(buildCqlFilter).join(') OR (')})`
};
