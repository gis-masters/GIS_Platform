import { AnnotationsFontProperties } from '../../map/labels/map-labels.models';
import { isFontProperties } from './isFontProperties';

const keys = new Set(['area', 'length', 'turningPoints', 'distances', 'annotations']);

export function isAnnotationsFontProperties(value: unknown): value is AnnotationsFontProperties {
  return (
    !!value &&
    typeof value === 'object' &&
    Object.keys(value).every(key => keys.has(key) && isFontProperties(value[key]))
  );
}
