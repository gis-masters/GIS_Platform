import { type Attribute } from '../../../geoserver/featureType/featureType.model';
import {
  type PropertySchema,
  type PropertySchemaFloat,
  type PropertySchemaGeometry,
  type PropertySchemaInt,
  type PropertySchemaString,
  PropertyType
} from '../schema.models';

export function convertGeoserverPropertiesToSchemaProperties(attributes: Attribute[] = []): PropertySchema[] {
  return attributes.map(attribute => {
    if (attribute.binding.includes('org.locationtech.jts.geom')) {
      return {
        name: attribute.name,
        title: 'Геометрия',
        propertyType: PropertyType.GEOMETRY
      } as PropertySchemaGeometry;
    }

    switch (attribute.binding) {
      case 'java.lang.String': {
        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.STRING,
          maxLength: attribute.length
        } as PropertySchemaString;
      }
      case 'java.math.BigInteger':
      case 'java.lang.Long':
      case 'java.lang.Integer': {
        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.INT
        } as PropertySchemaInt;
      }
      case 'java.lang.Double': {
        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.FLOAT
        } as PropertySchemaFloat;
      }
      default: {
        console.warn(`Unsupported attribute type: '${attribute.binding}' Handled as String`);

        return {
          name: attribute.name,
          title: attribute.name,
          propertyType: PropertyType.STRING,
          maxLength: attribute.length
        } as PropertySchemaString;
      }
    }
  });
}
