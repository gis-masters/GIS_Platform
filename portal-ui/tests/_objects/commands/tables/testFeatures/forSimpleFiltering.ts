import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forSimpleFiltering: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_539_788.0225, 5_038_785.3057],
            [6_557_307.506, 5_001_136.4872],
            [6_571_117.5135, 5_040_987.2947],
            [6_539_788.0225, 5_038_785.3057]
          ]
        ]
      ]
    },
    properties: {
      name: 'Большой'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_576_921.4146, 5_040_413.5776],
            [6_611_237.7725, 5_042_853.0855],
            [6_591_642.6727, 5_002_399.2786],
            [6_576_921.4146, 5_040_413.5776]
          ]
        ]
      ]
    },
    properties: {
      name: 'Тоже большой'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_569_090.4152, 5_003_520.4676],
            [6_574_841.1698, 5_019_494.451],
            [6_584_003.4275, 5_002_731.0776],
            [6_569_090.4152, 5_003_520.4676]
          ]
        ]
      ]
    },
    properties: {
      name: 'Маленький'
    }
  }
];
