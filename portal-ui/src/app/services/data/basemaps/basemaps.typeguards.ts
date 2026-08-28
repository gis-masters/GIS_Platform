import { isObject } from 'lodash';

import { type Basemap, SourceType } from './basemaps.models';

export function isSourceType(value: unknown): value is SourceType {
  return Object.values(SourceType).includes(value as SourceType);
}

export function isBasemap(obj: unknown): obj is Basemap {
  return (
    isObject(obj) &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'type' in obj &&
    isSourceType(obj.type)
  );
}
