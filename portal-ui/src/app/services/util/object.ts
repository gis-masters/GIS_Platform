import { isArray } from './typeGuards/isArray';
import { isRecordStringUnknown } from './typeGuards/isRecordStringUnknown';

export function replaceObjectKeys(
  obj: Record<string, unknown> | string | number | unknown[],
  keyMap: Record<string, string>
): unknown {
  if (isArray(obj)) {
    return obj.map(item => {
      if (isRecordStringUnknown(item)) {
        return replaceObjectKeys(item, keyMap);
      }

      return item;
    });
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
      const newKey = keyMap[key] || key;

      if (
        typeof newKey === 'string' &&
        (isRecordStringUnknown(value) || typeof value === 'string' || typeof value === 'number' || isArray(value))
      ) {
        acc[newKey] = replaceObjectKeys(value, keyMap);
      }

      return acc;
    }, {});
  }

  return obj;
}
