import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const singleFeature: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_758.7315, 5_000_036.7818],
            [6_656_838.9585, 5_000_026.9187],
            [6_656_825.0057, 4_999_915.6515],
            [6_656_742.9142, 4_999_927.7289],
            [6_656_758.7315, 5_000_036.7818]
          ]
        ]
      ]
    },
    properties: {
      name: 'объект 1',
      text: 'заголовок 1',
      shape_area: 10
    }
  }
];
