import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const theLetterC: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_657_443, 5_000_413],
            [6_657_329, 5_000_410],
            [6_657_335, 5_000_235],
            [6_657_448, 5_000_237],
            [6_657_447, 5_000_254],
            [6_657_351, 5_000_252],
            [6_657_346, 5_000_394],
            [6_657_443, 5_000_397],
            [6_657_443, 5_000_413]
          ]
        ]
      ]
    },
    properties: {}
  }
];
