import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forLegendTest2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_794.8113, 5_000_042.7171],
            [6_656_817.0923, 5_000_058.139],
            [6_656_850.9329, 5_000_030.6036],
            [6_656_815.0035, 5_000_019.5276],
            [6_656_794.8113, 5_000_042.7171]
          ]
        ]
      ]
    },
    properties: {
      cad_num: 'объект 1',
      status: 'Выполнение комплекса кадастровых работ'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_796.4039, 4_999_981.3727],
            [6_656_828.4131, 4_999_995.9872],
            [6_656_830.1226, 4_999_964.137],
            [6_656_790.8935, 4_999_957.2716],
            [6_656_796.4039, 4_999_981.3727]
          ]
        ]
      ]
    },
    properties: {
      cad_num: 'объект 2',
      status: 'Кадастровые работы в отношении лесных участков'
    }
  }
];
