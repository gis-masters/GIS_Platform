import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const multiPolygon2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_824.3275, 5_000_055.3246],
            [6_656_845.9752, 5_000_054.6265],
            [6_656_841.0326, 5_000_044.53],
            [6_656_820.9612, 5_000_041.4496],
            [6_656_824.3275, 5_000_055.3246]
          ]
        ],
        [
          [
            [6_656_858.1567, 5_000_051.848],
            [6_656_875.6977, 5_000_052.2802],
            [6_656_871.6229, 5_000_042.082],
            [6_656_858.0629, 5_000_035.5907],
            [6_656_858.1567, 5_000_051.848]
          ]
        ]
      ]
    },
    properties: {}
  }
];
