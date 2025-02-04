import { isObject } from 'lodash';

export interface FiasValue {
  id?: number;
  oktmo?: string;
  address?: string;
}

export interface FiasApiItem {
  fullAddress?: string;
  locality?: string;
  objectId: number;
  oktmo: string;
}

export function isFiasValue(obj: unknown): obj is FiasValue {
  return isObject(obj);
}
