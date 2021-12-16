import { FilterQuery, FilterQueryValue } from './filterObjects';

export function buildCqlFilter(query: FilterQuery): string {
  return Object.entries(query)
    .map(([key, val]) => {
      if (topLevelOperators[key]) {
        return topLevelOperators[key](val as FilterQuery[]);
      }

      if (['string', 'number', 'boolean'].includes(typeof val)) {
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
  $eq: (key: string, value: string | number | boolean) => `${key} = '${String(value)}'`,
  $like: (key: string, value: string) => `${key} LIKE '${value}'`,
  $ilike: (key: string, value: string) => `${key} ILIKE '${value}'`,
  $in: (key: string, value: string[]) => `${key} IN('${value.join("','")}')`,
  $gt: (key: string, value: string | number) => `${key} > '${value}'`,
  $lt: (key: string, value: string | number) => `${key} < '${value}'`,
  $gte: (key: string, value: string | number) => `${key} >= '${value}'`,
  $lte: (key: string, value: string | number) => `${key} <= '${value}'`
};

const topLevelOperators: Record<string, (value: FilterQuery[]) => string> = {
  $and: (value: FilterQuery[]) => `(${value.map(buildCqlFilter).join(') AND (')})`,
  $or: (value: FilterQuery[]) => `(${value.map(buildCqlFilter).join(') OR (')})`
};
