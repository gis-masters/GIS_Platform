interface QueryObject {
  [key: string]: string | number | QueryObject;
}

interface Operators {
  [key: string]: (key: string, value: string | number | QueryObject) => string;
}

export function buildCqlFilter(query: QueryObject): string {
  return Object.entries(query)
    .map(([key, val]) => {
      const operator = operators[key] || operators.$eq;

      return operator(key, val);
    })
    .join(' AND ');
}

const operators: Operators = {
  $eq: (key: string, value: string) => `${key} ILIKE '%${value}%'`
};
