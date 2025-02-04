import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const smallTriangle: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_816, 5_000_020],
            [6_656_817, 5_000_018],
            [6_656_816, 5_000_016],
            [6_656_816, 5_000_020]
          ]
        ]
      ]
    },
    properties: {}
  }
];
