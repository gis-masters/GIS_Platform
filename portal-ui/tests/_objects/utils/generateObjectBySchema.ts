import { faker } from '@faker-js/faker';

import { PropertyType, Schema } from '../../../src/app/services/data/schema/schema.models';

export const supportedTypesForGeneration: PropertyType[] = [
  PropertyType.STRING,
  PropertyType.DATETIME,
  PropertyType.FLOAT,
  PropertyType.INT
];

export function generateObjectBySchema(schema: Schema): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const { propertyType, name } of schema.properties) {
    switch (propertyType) {
      case PropertyType.STRING: {
        result[name] = faker.lorem.sentence(10);

        break;
      }
      case PropertyType.DATETIME: {
        result[name] = faker.date.past().toISOString().split('T')[0];

        break;
      }
      case PropertyType.FLOAT: {
        result[name] = faker.datatype.float();

        break;
      }
      case PropertyType.INT: {
        result[name] = faker.datatype.number();

        break;
      }
      default: {
        console.warn(`generateRandomProperties не поддерживает тип поля: ${propertyType}`);
      }
    }
  }

  return result;
}
