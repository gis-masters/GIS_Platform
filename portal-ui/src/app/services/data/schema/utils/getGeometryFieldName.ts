import { PropertyType, type Schema } from '../schema.models';

export function getGeometryFieldName(schema: Schema): string {
  const gProperty = schema.properties.find(prop => prop.propertyType === PropertyType.GEOMETRY);
  if (!gProperty) {
    throw new Error(`В схеме: '${schema.name}' не найдено свойство с геометрией`);
  }

  return gProperty.name || 'shape';
}
