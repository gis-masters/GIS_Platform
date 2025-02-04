import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forPhotoLayerWithMultipleObjects: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_816.2532, 5_000_018.9837],
            [6_656_833.8076, 5_000_016.669],
            [6_656_832.1301, 4_999_999.9639],
            [6_656_813.2806, 5_000_001.7513],
            [6_656_816.2532, 5_000_018.9837]
          ]
        ]
      ]
    },
    properties: {
      title: 'Объект фотослоя 1',
      photo: []
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_816.2532, 5_000_018.9837],
            [6_656_833.8076, 5_000_016.669],
            [6_656_832.1301, 4_999_999.9639],
            [6_656_813.2806, 5_000_001.7513],
            [6_656_816.2532, 5_000_018.9837]
          ]
        ]
      ]
    },
    properties: {
      title: 'Объект фотослоя 2',
      photo: []
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_816.2532, 5_000_018.9837],
            [6_656_833.8076, 5_000_016.669],
            [6_656_832.1301, 4_999_999.9639],
            [6_656_813.2806, 5_000_001.7513],
            [6_656_816.2532, 5_000_018.9837]
          ]
        ]
      ]
    },
    properties: {
      title: 'Объект фотослоя 3',
      photo: []
    }
  }
];
