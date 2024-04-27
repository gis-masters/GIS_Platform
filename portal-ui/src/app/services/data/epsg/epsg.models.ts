import { isObject } from 'lodash';

import { EpsgModel } from '../../../../server-types/common-contracts';

export const DEFAULT_OL_PROJECTION = {
  authName: 'EPSG',
  code: 3857
};

export const defaultOlCrs = `${DEFAULT_OL_PROJECTION.authName}:${DEFAULT_OL_PROJECTION.code}`;

export interface Epsg extends EpsgModel {
  title: string;
  auth_srid: number;
  hidden?: boolean;
  proj4Str?: string;
  defaultProj?: string;
}

export function isArrayOfEpsg(values: unknown): values is Epsg[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (!isEpsg(value)) {
      return false;
    }
  }

  return true;
}

export function isEpsg(obj: unknown): obj is Epsg {
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
