import { clone } from 'lodash';

import { GeometryType, NewWfsFeature } from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { generateObjectBySchema } from '../../utils/generateObjectBySchema';

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

function generateRandomFeatures(schema: Schema, count: number): NewWfsFeature[] {
  const features: NewWfsFeature[] = [];

  for (let i = 0; i < count; i++) {
    const newFeature = clone(baseFeature);
    newFeature.properties = generateObjectBySchema(schema);

    features.push(newFeature);
  }

  return features;
}

export function getPreparedFeatures(title: string, schema?: Schema): NewWfsFeature[] {
  const features: NewWfsFeature[] = [];

  switch (title) {
    case 'для тестирования прокола':
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
          properties: {
            number_int: 314,
            number_double: 3.14,
            some_string: 'привет worldwide',
            some_date: '2023-02-01',
            some_document: '[{"id":314,"title":"sequi","libraryTableName":"dl_default"}]',
            is_enabled: true
          }
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
          properties: {
            number_int: 5555,
            number_double: 0.58,
            some_string: 'some other text',
            some_date: '2011-07-01',
            some_document: '[{"id":314,"title":"sciurus","libraryTableName":"dl_default"}]',
            obj_code: '1122'
          }
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
          properties: {
            number_int: 9,
            number_double: 644,
            some_string: 'привет мир',
            some_date: '1990-02-28',
            is_enabled: false,
            some_document: '[{"id":314,"title":"catta","libraryTableName":"dl_default"}]',
            obj_code: '1122'
          }
        }
      );

      break;
    }
    case 'тестирование фильтрации': {
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
          properties: {
            field_int: 314,
            field_double: 3.14,
            field_string: 'привет worldwide',
            field_date: '2023-02-01',
            field_document: '[{"id":314,"title":"sequi","libraryTableName":"dl_default"}]',
            field_boolean: true
          }
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
          properties: {
            field_int: 5555,
            field_double: 0.58,
            field_string: 'some other text',
            field_date: '2011-07-01',
            field_document: '[{"id":314,"title":"sciurus","libraryTableName":"dl_default"}]'
          }
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
          properties: {
            field_int: 9,
            field_double: 644,
            field_string: 'привет мир',
            field_date: '1990-02-28',
            field_boolean: false,
            field_document: '[{"id":314,"title":"catta","libraryTableName":"dl_default"}]'
          }
        }
      );

      break;
    }
    case 'для тестирования фильтрации': {
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
          properties: {
            shape_area: 1,
            is_enabled: true
          }
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
          properties: {
            shape_area: 2,
            is_enabled: true
          }
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
          properties: {
            shape_area: 4,
            is_enabled: true
          }
        }
      );

      break;
    }
    case 'для тестирования фильтрации 2': {
      features.push(
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [
              [
                [
                  [6_657_031.7031, 4_999_744.4022],
                  [6_657_031.723, 4_999_728.6699],
                  [6_657_051.4104, 4_999_728.964],
                  [6_657_051.0738, 4_999_744.738],
                  [6_657_031.7031, 4_999_744.4022]
                ]
              ]
            ]
          },
          properties: {
            shape_area: 100,
            is_enabled: true
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [
              [
                [
                  [6_657_079.1077, 4_999_771.6994],
                  [6_657_101.6316, 4_999_772.7432],
                  [6_657_077.0389, 4_999_745.0071],
                  [6_657_079.1077, 4_999_771.6994]
                ]
              ]
            ]
          },
          properties: {
            shape_area: 200,
            is_enabled: true
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: GeometryType.MULTI_POLYGON,
            coordinates: [
              [
                [
                  [6_657_016.7109, 4_999_722.3024],
                  [6_657_116.4014, 4_999_724.7314],
                  [6_657_115.5985, 4_999_719.8615],
                  [6_657_016.1702, 4_999_718.2005],
                  [6_657_016.7109, 4_999_722.3024]
                ]
              ]
            ]
          },
          properties: {
            shape_area: 300,
            is_enabled: true
          }
        }
      );

      break;
    }
    case 'данные для тестирования сортировки с пагинацией': {
      if (!schema) {
        throw new Error('Для этого сценария нужно передать схему');
      }

      generateRandomFeatures(schema, 27).forEach(feature => {
        features.push(feature);
      });

      break;
    }
    case 'данные в количестве 628 для тестирования фильтрации': {
      if (!schema) {
        throw new Error('Для этого сценария нужно передать схему');
      }

      generateRandomFeatures(schema, 628).forEach(feature => {
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
