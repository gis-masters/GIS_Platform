import { isRecordStringUnknown } from '../../util/typeGuards/isRecordStringUnknown';
import { type CrgLayer, CrgLayerType, type CrgVectorLayer } from './layers.models';

export function isCrgLayer(value: unknown): value is CrgLayer {
  if (!isRecordStringUnknown(value)) {
    return false;
  }

  return typeof value.id === 'number' && Object.values(CrgLayerType).includes(value.type as CrgLayerType);
}

export function isVectorLayer(layer?: unknown): layer is CrgVectorLayer {
  if (!isCrgLayer(layer)) {
    return false;
  }

  return layer.type === CrgLayerType.VECTOR;
}
