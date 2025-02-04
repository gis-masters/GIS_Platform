import { CircleProperties } from '../../map/labels/map-labels.models';

const circlePropertiesKeys = new Set(['fillColor', 'strokeColor', 'radius']);

export function isCircleProperties(value: unknown): value is CircleProperties {
  return (
    !!value &&
    typeof value === 'object' &&
    Object.keys(value).some(key => circlePropertiesKeys.has(key) && typeof value[key] === 'string')
  );
}
