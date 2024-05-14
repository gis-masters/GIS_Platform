import { isObject } from 'lodash';

import { SpatialReferenceSystem } from '../../../../server-types/common-contracts';

export const DEFAULT_OL_PROJECTION = {
  authName: 'EPSG',
  code: 3857
};

export const defaultOlCrs = `${DEFAULT_OL_PROJECTION.authName}:${DEFAULT_OL_PROJECTION.code}`;

export interface Projection extends SpatialReferenceSystem {
  title: string;
  auth_srid: number;
  hidden?: boolean;
  proj4Str?: string;
  defaultProj?: string;
}

export function isArrayOfProjection(values: unknown): values is Projection[] {
  if (!Array.isArray(values)) {
    return false;
  }

  for (const value of values) {
    if (!isProjection(value)) {
      return false;
    }
  }

  return true;
}

export function isProjection(obj: unknown): obj is Projection {
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
