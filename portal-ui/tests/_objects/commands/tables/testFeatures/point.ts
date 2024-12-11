import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const point: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.POINT,
      coordinates: [6_656_816.2532, 5_000_018.9837]
    },
    properties: {}
  }
];
