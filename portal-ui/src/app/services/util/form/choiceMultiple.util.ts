import { isString } from 'lodash';

import { isStringArray } from '../typeGuards/isStringArray';

export function getMultipleChoiceValue(value: unknown): string[] {
  if (value === '') {
    return [];
  }
  if (isStringArray(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === 'number') {
    return [String(value)];
  }

  if (!isString(value)) {
    return [];
  }

  try {
    const values = JSON.parse(value) as unknown;
    if (isStringArray(values)) {
      return values;
    }

    if (Array.isArray(values)) {
      return values.map(String);
    }

    if (typeof values === 'number') {
      return [String(values)];
    }
  } catch {
    // do nothing
  }

  return [String(value)];
}
