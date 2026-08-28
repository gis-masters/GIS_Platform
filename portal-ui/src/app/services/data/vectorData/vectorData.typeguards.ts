import { isObject } from 'lodash';

import { DataEntityType, type Dataset, type VectorTable } from './vectorData.models';

export function isDataset(obj: unknown): obj is Dataset {
  return isObject(obj) && 'type' in obj && obj.type === DataEntityType.DATASET;
}

export function isVectorTable(obj: unknown): obj is VectorTable {
  return isObject(obj) && 'type' in obj && obj.type === DataEntityType.TABLE;
}
