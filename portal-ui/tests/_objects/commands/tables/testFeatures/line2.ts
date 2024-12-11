import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const line2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.LINE_STRING,
      coordinates: [
        [6_656_784.7027, 5_000_003.6382],
        [6_656_790.2546, 5_000_019.7722],
        [6_656_818.2399, 5_000_018.8026],
        [6_656_834.1569, 5_000_039.2209]
      ]
    },
    properties: {}
  }
];
