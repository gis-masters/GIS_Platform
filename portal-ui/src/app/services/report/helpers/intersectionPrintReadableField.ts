import { type PropertySchema } from '../../data/schema/schema.models';
import { getReadablePropertyValue } from '../../data/schema/utils/getReadablePropertyValue';

export function readableIntersectionField(
  props: Record<string, unknown>,
  fieldName: string,
  schemas?: PropertySchema[]
): string {
  const value = props[fieldName];
  const propSchema = schemas?.find(({ name }) => name === fieldName);
  if (propSchema) {
    return getReadablePropertyValue(value, propSchema);
  }
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}
