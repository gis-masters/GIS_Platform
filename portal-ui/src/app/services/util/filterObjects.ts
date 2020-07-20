export type FilterParams<T> = { [key in keyof T]?: string };

type CustomFieldsPrep<T, F extends keyof T> = (a: T[F], item?: T) => string | number;
export type CustomFilterFieldsPrep<T> = { [key in keyof T]?: CustomFieldsPrep<T, key> };

export function filterObjects<T>(arr: T[], params: FilterParams<T>, customFieldsPrep?: CustomFilterFieldsPrep<T>): T[] {
  return arr.filter(item =>
    Object.entries(item).every(([key, value]) => {
      if (!params[key]) {
        return true;
      }

      if (customFieldsPrep && customFieldsPrep[key]) {
        value = customFieldsPrep[key](value, item);
      }

      return String(value).toLowerCase().includes(params[key].toLowerCase());
    })
  );
}
