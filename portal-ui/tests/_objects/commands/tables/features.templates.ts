import { clone } from 'lodash';
import { faker } from '@faker-js/faker';

import { GeometryType, NewWfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { PropertySchema, PropertyType, Schema } from '../../../../src/app/services/data/schema/schema.models';

const baseFeature: NewWfsFeature = {
  type: 'Feature',
  geometry: {
    type: GeometryType.MULTI_POLYGON,
    coordinates: [
      [
        [
          [6_657_058.3102, 4_999_784.8132],
          [6_657_069.4935, 4_999_785.0891],
          [6_657_066.2984, 4_999_726.5265],
          [6_657_059.1796, 4_999_727.4389],
          [6_657_058.3102, 4_999_784.8132]
        ]
      ]
    ]
  },
  properties: {}
};

function generateRandomProperties(properties: PropertySchema[]): { [key: string]: string | Date | number } {
  const result: { [key: string]: string | Date | number } = {};

  properties.forEach(property => {
    const { propertyType, name } = property;

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
        console.warn(`via generateRandomProperties used unsupported property type: ${propertyType}`);
      }
    }
  });

  return result;
}

function generateRandomFeatures(properties: PropertySchema[], count: number): NewWfsFeature[] {
  const features: NewWfsFeature[] = [];

  for (let i = 0; i < count; i++) {
    const newFeature = clone(baseFeature);
    newFeature.properties = generateRandomProperties(properties);

    features.push(newFeature);
  }

  return features;
}

export function getPreparedFeatures(title: string, schema?: Schema): NewWfsFeature[] {
  const features: NewWfsFeature[] = [];

  switch (title) {
    case 'данные для тестирования сортировки': {
      features.push(
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [
              [
                [
                  [6_657_047.4063, 4_999_784.2722],
                  [6_657_013.8497, 4_999_783.7166],
                  [6_657_013.8603, 4_999_727.9532],
                  [6_657_023.1343, 4_999_728.182],
                  [6_657_022.8372, 4_999_751.2962],
                  [6_657_041.3919, 4_999_751.4818],
                  [6_657_041.1438, 4_999_761.5403],
                  [6_657_023.148, 4_999_760.8245],
                  [6_657_023.9173, 4_999_773.9003],
                  [6_657_047.1022, 4_999_774.4721],
                  [6_657_047.4063, 4_999_784.2722]
                ]
              ]
            ]
          },
          properties: { number_int: 314, number_double: 3.14, some_string: 'строка текста', some_date: '2023-02-01' }
        },
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [
              [
                [
                  [6_657_058.3102, 4_999_784.8132],
                  [6_657_069.4935, 4_999_785.0891],
                  [6_657_066.2984, 4_999_726.5265],
                  [6_657_059.1796, 4_999_727.4389],
                  [6_657_058.3102, 4_999_784.8132]
                ]
              ]
            ]
          },
          properties: { number_int: 5555, number_double: 0.58, some_string: 'some other text', some_date: '2011-07-01' }
        },
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [
              [
                [
                  [6_657_080.1447, 4_999_784.8079],
                  [6_657_116.9745, 4_999_785.4446],
                  [6_657_119.3981, 4_999_775.7118],
                  [6_657_086.7804, 4_999_737.0965],
                  [6_657_120.0176, 4_999_739.5487],
                  [6_657_116.9792, 4_999_729.9531],
                  [6_657_076.3706, 4_999_727.591],
                  [6_657_076.6076, 4_999_740.1097],
                  [6_657_109.5853, 4_999_775.1977],
                  [6_657_078.7495, 4_999_774.9808],
                  [6_657_080.1447, 4_999_784.8079]
                ]
              ]
            ]
          },
          properties: { number_int: 9, number_double: 644, some_string: 'привет мир', some_date: '1990-02-28' }
        }
      );

      break;
    }
    case 'для тестирования фильтрации': {
      // Some
      break;
    }
    case 'данные для тестирования сортировки с пагинацией': {
      if (!schema || !schema.properties) {
        throw new Error('Для этого сценария нужно передать схему c properties');
      }

      generateRandomFeatures(schema.properties, 27).forEach(feature => {
        features.push(feature);
      });

      break;
    }
    default: {
      throw new Error('Указан не существующий ключ для шаблонных фичей');
    }
  }

  return features;
}
