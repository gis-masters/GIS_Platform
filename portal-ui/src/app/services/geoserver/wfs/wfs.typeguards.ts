import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';
import { type WfsFeature } from './wfs.models';

export function isWfsFeature(value: unknown): value is WfsFeature {
  if (!isRecordStringUnknown(value)) {
    return false;
  }

  if (value.type !== 'Feature') {
    return false;
  }

  if (typeof value.id !== 'string') {
    return false;
  }

  if (typeof value.geometry_name !== 'string') {
    return false;
  }

  const props = value.properties;

  return props !== null && typeof props === 'object';
}
