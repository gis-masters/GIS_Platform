import { faker } from '@faker-js/faker/locale/ru';
import { uniqueId } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { PropertyType, Schema } from '../data/schema/schema.models';

export function generateObjectBySchema(schema: Schema): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const property of schema.properties) {
    switch (property.propertyType) {
      case PropertyType.STRING: {
        result[property.name] = 'Текстовая строка';

        break;
      }
      case PropertyType.DATETIME: {
        result[property.name] = faker.date.past().toISOString().split('T')[0];

        break;
      }
      case PropertyType.BOOL: {
        result[property.name] = Math.random() > 0.5;

        break;
      }
      case PropertyType.FLOAT: {
        result[property.name] = faker.number.float({ min: 0, max: 99_999, precision: 0.01 });

        break;
      }
      case PropertyType.INT: {
        result[property.name] = faker.number.int({ min: 0, max: 99_999 });

        break;
      }
      case PropertyType.URL: {
        result[property.name] = JSON.stringify([
          { url: faker.internet.url(), text: faker.science.chemicalElement().name }
        ]);

        break;
      }
      case PropertyType.FILE: {
        const filesCount = Number(!property.multiple) || faker.number.int({ max: 5, min: 2 });
        const files = [];

        for (let i = 0; i < filesCount; i++) {
          files.push({
            id: faker.string.uuid(),
            size: faker.number.int({ min: 0, max: 99_999 }),
            title: `${faker.hacker.noun()}.pdf`
          });
        }

        result[property.name] = files;

        break;
      }
      case PropertyType.DOCUMENT: {
        const id = faker.number.int({ min: 0, max: 99_999 });
        const tableName = faker.hacker.ingverb();

        result[property.name] = JSON.stringify([{ id, title: faker.hacker.adjective(), libraryTableName: tableName }]);

        break;
      }
      case PropertyType.CHOICE: {
        result[property.name] = property.options[Math.floor(Math.random() * property.options.length)].value;

        break;
      }

      case PropertyType.USER: {
        result[property.name] = JSON.stringify([
          {
            surname: 'Иван',
            email: 'pikabu@mail.ru',
            name: 'Иванов',
            id: 374
          }
        ]);

        break;
      }

      case PropertyType.USER_ID: {
        result[property.name] = currentUser.id;

        break;
      }

      case PropertyType.UUID: {
        result[property.name] = uniqueId();

        break;
      }

      default: {
        result[property.name] = `Тип поля: ${property.propertyType}`;
      }
    }
  }

  return result;
}
