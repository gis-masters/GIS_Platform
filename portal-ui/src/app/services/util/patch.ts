import { action } from 'mobx';
import { isEqual } from 'lodash';

export const patch: <T>(obj: T, patch: Partial<T>) => void = action((obj, patch) => {
  Object.assign(obj, patch);
});

export function getPatch<T>(objNew: T, objPrimal: T, fields: (keyof T)[] = Object.keys(objPrimal)): Partial<T> {
  const patch: Partial<T> = {};

  fields.forEach(key => {
    if (!isEqual(objNew[key], objPrimal[key])) {
      patch[key] = objNew[key];
      if (patch[key] === undefined) {
        patch[key] = null;
      }
    }
  });

  return patch;
}
