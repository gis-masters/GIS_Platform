import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forCopy: NewWfsFeature[] = [
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
      field_document: '[]',
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
      field_document: '[]'
    }
  },
  {
    type: 'Feature',
    properties: {
      field_int: 9,
      field_double: 644,
      field_string: 'без геометрии',
      field_date: '1990-02-28',
      field_boolean: false,
      field_document: '[]'
    }
  }
];
