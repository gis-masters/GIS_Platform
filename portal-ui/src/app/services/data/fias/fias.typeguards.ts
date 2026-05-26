import { isObject } from 'lodash';

import { type FiasValue } from './fias.models';

export function isFiasValue(obj: unknown): obj is FiasValue {
  return isObject(obj);
}
