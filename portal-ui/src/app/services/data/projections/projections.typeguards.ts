import { isObject } from 'lodash';

import { type Projection } from './projections.models';

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
