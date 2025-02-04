import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const multiLine2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_LINE_STRING,
      coordinates: [
        [
          [6_656_780.2595, 5_000_053.5947],
          [6_656_794.173, 5_000_062.9783],
          [6_656_815.7713, 5_000_060.3564],
          [6_656_830.2764, 5_000_071.4367]
        ],
        [
          [6_656_832.3345, 5_000_073.59],
          [6_656_848.1067, 5_000_076.0811],
          [6_656_854.8194, 5_000_060.6877]
        ]
      ]
    },
    properties: {}
  }
];
