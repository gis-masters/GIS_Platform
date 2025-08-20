import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forLegendTest1: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_745.2163, 4_999_918.6401],
            [6_656_871.6596, 5_000_013.3436],
            [6_656_890.2728, 4_999_953.1447],
            [6_656_797.6811, 4_999_883.1756],
            [6_656_745.2163, 4_999_918.6401]
          ]
        ]
      ]
    },
    properties: {
      cad_num: 'объект 3',
      status: 'Нет замечаний'
    }
  }
];
