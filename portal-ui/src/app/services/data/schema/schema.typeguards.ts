import { isObject } from 'lodash';

import { isArray } from '../../util/typeGuards/isArray';
import { type PropertySchema, PropertyType } from './schema.models';

export function isPropertyType(value: unknown): value is PropertyType {
  return Object.values(PropertyType).includes(value as PropertyType);
}

export function isPropertySchema(obj: unknown): obj is PropertySchema {
  return (
    isObject(obj) &&
    'propertyType' in obj &&
    isPropertyType(obj.propertyType) &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string'
  );
}

export function isPropertySchemaArray(arr: unknown): arr is PropertySchema[] {
  return isArray(arr) && arr.every(isPropertySchema);
}
