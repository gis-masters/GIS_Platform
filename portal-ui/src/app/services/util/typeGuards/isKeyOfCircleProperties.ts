import { CircleProperties } from '../../map/map-labels.models';

const circlePropertiesKeys = new Set(['radius', 'fillColor', 'strokeColor']);

export function isKeyofCircleProperties(value: unknown): value is keyof CircleProperties {
  return typeof value === 'string' && circlePropertiesKeys.has(value);
}
