import { PropertyType } from '../schema.models';

const readablePropertyTypes = new Set<PropertyType>([
  PropertyType.STRING,
  PropertyType.TEXT,
  PropertyType.INT,
  PropertyType.LONG,
  PropertyType.FLOAT,
  PropertyType.DATETIME,
  PropertyType.TIME,
  PropertyType.CHOICE,
  PropertyType.UUID,
  PropertyType.USER_ID
]);

export function isReadableProperty(property: { propertyType?: PropertyType }): boolean {
  return property.propertyType !== undefined && readablePropertyTypes.has(property.propertyType);
}
