import { action } from 'mobx';
import { isEqual } from 'lodash';

import { ValueOf } from '../models';

export const patch: <T extends object>(obj: T, patch: Partial<T>) => void = action((obj, patch) => {
  Object.assign(obj, patch);
});

export function getPatch<T>(
  objNew: T,
  objPrimal: T,
  fields: (keyof T)[] = Object.keys({ ...objPrimal, ...objNew })
): Partial<T> {
  const patch: Partial<Record<keyof T, ValueOf<T> | null>> = {};

  fields.forEach(key => {
    if (!isEqual(objNew[key], objPrimal[key])) {
      patch[key] = objNew[key];
      if (patch[key] === undefined) {
        patch[key] = null;
      }
    }
  });

  return patch as Partial<T>;
}
