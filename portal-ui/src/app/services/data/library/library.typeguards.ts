import { isObject } from 'lodash';

import { DataEntityType } from '../vectorData/vectorData.models';
import { type Library, type LibraryRecord } from './library.models';

export function isLibrary(obj: unknown): obj is Library {
  return isObject(obj) && 'type' in obj && obj.type === DataEntityType.LIBRARY;
}

export function isLibraryRecord(obj: unknown): obj is LibraryRecord {
  return (
    isObject(obj) &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'path' in obj &&
    typeof obj.path === 'string' &&
    'libraryTableName' in obj &&
    typeof obj.libraryTableName === 'string'
  );
}
