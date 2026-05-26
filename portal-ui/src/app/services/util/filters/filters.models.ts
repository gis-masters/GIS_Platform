export type FilterQueryValue = string | number | boolean | RegExp | FilterQueryValue[] | null;

export interface FilterQuery {
  [key: string]: FilterQueryValue | FilterQuery | FilterQuery[];
}
