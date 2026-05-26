import { isObject } from 'lodash';

import { type LibraryRecord } from './library.models';

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
