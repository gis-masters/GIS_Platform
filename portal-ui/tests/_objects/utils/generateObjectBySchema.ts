import { faker } from '@faker-js/faker';

import { PropertyType, Schema } from '../../../src/app/services/data/schema/schema.models';
import { logLevel } from '../commands/logLevel';

export const supportedTypesForGeneration: PropertyType[] = [
  PropertyType.STRING,
  PropertyType.DATETIME,
  PropertyType.FLOAT,
  PropertyType.INT
];

export function generateObjectBySchema(schema: Schema, objectCount?: number): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const property of schema.properties) {
    const { propertyType, name } = property;
    switch (property.propertyType) {
      case PropertyType.STRING: {
        if (name.includes('__address') || name.includes('__oktmo')) {
          break;
        }

        result[name] = faker.lorem.sentence(10).slice(0, property.maxLength);

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
        result[name] = faker.number.float({ min: 0, max: 99_999, precision: 0.01 });

        break;
      }
      case PropertyType.INT: {
        result[name] = faker.number.int({ min: 0, max: 99_999 });

        break;
      }
      case PropertyType.URL: {
        result[name] = `[{"url":"${faker.internet.url()}","text":"${faker.science.chemicalElement().name}"}]`;

        break;
      }
      case PropertyType.FIAS: {
        let address = 'Севастополь, вн.тер.г. Андреевский муниципальный округ, п Солнечный, ул Андреевская, д.1';
        // для возможности фильтрации по полю FIAS у нескольких документов
        if (objectCount) {
          address = objectCount + address;
        }

        result[`${name}__address`] = address;
        result[`${name}__oktmo`] = '67318000106';

        break;
      }
      case PropertyType.FILE: {
        const filesCount = Number(faker.string.numeric());
        const files = [];

        for (let i = 0; i < filesCount; i++) {
          files.push({
            id: faker.string.uuid(),
            size: faker.number.int({ min: 0, max: 99_999 }),
            title: `${faker.hacker.noun()}.fiz`
          });
        }

        result[name] = files;

        break;
      }
      case PropertyType.DOCUMENT: {
        const id = faker.number.int({ min: 0, max: 99_999 });
        const tableName = faker.hacker.ingverb();

        result[name] = `[{"id":${id},"title":"${faker.hacker.adjective()}","libraryTableName":"${tableName}"}]`;

        break;
      }
      default: {
        if (logLevel()) {
          console.warn(`generateObjectBySchema не поддерживает тип поля: ${propertyType}`);
        }
      }
    }
  }

  return result;
}
