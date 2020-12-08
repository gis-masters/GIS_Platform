import { action } from 'mobx';

export const patch: <T>(obj: T, patch: Partial<T>) => void = action((obj, patch) => {
  Object.assign(obj, patch);
});

export function getPatch<T>(
  objNew: T,
  objPrimal: T,
  fields: (keyof T)[] = Object.keys(objPrimal) as (keyof T)[]
): Partial<T> {
  const patch: Partial<T> = {};

  fields.forEach(key => {
    if (objNew[key] !== objPrimal[key]) {
      patch[key] = objNew[key];
    }
  });

  return patch;
}
