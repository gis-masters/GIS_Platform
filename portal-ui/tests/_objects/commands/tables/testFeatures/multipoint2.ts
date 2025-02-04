import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const multiPoint2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POINT,
      coordinates: [
        [6_656_816.2532, 5_000_018.9837],
        [6_656_833.8076, 5_000_016.669]
      ]
    },
    properties: {}
  }
];
