import { faker } from '@faker-js/faker';

import { PropertyType, Schema } from '../../../src/app/services/data/schema/schema.models';
import { logLevel } from '../commands/logLevel';

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
      case PropertyType.BOOL: {
        result[name] = Math.random() > 0.5;

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
      case PropertyType.URL: {
        result[name] = `[{"url":"${faker.internet.url()}","text":"${faker.science.chemicalElement().name}"}]`;

        break;
      }
      case PropertyType.FILE: {
        const filesCount = Number(faker.random.numeric());
        const files = [];

        for (let i = 0; i < filesCount; i++) {
          files.push({
            id: faker.datatype.uuid(),
            size: faker.datatype.number(),
            title: `${faker.hacker.noun()}.fiz`
          });
        }

        result[name] = files;

        break;
      }
      case PropertyType.DOCUMENT: {
        result[
          name
        ] = `[{"id":${faker.datatype.number()},"title":"${faker.hacker.adjective()}","libraryTableName":"${faker.hacker.ingverb()}"}]`;

        break;
      }
      default: {
        if (logLevel()) {
          console.warn(`generateRandomProperties не поддерживает тип поля: ${propertyType}`);
        }
      }
    }
  }

  return result;
}
