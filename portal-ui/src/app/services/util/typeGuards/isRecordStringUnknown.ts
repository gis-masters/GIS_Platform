import { isObject } from 'lodash';

export function isRecordStringUnknown(value: unknown): value is Record<string, unknown> {
  if (Array.isArray(value) || !isObject(value)) {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (typeof key !== 'string') {
      return false;
    }
  }

  return true;
}
