import { isObject } from 'lodash';

import { EpsgModel } from '../../../../server-types/common-contracts';

export interface EpsgModelModified extends EpsgModel {
  title: string;
  auth_srid: number;
  defaultProj?: string;
}

export function isArrayOfEpsgModelModified(values: unknown): values is EpsgModelModified[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (!isEpsgModelModified(value)) {
      return false;
    }
  }

  return true;
}

export function isEpsgModelModified(obj: unknown): obj is EpsgModelModified {
  return (
    isObject(obj) &&
    'authName' in obj &&
    typeof obj.authName === 'string' &&
    'authSrid' in obj &&
    typeof obj.authSrid === 'number' &&
    'srtext' in obj &&
    typeof obj.srtext === 'string' &&
    'proj4Text' in obj &&
    typeof obj.proj4Text === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'auth_srid' in obj &&
    typeof obj.auth_srid === 'number'
  );
}
