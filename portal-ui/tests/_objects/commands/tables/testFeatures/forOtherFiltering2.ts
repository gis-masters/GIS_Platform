import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
export const forOtherFiltering2: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_657_031.7031, 4_999_744.4022],
            [6_657_031.723, 4_999_728.6699],
            [6_657_051.4104, 4_999_728.964],
            [6_657_051.0738, 4_999_744.738],
            [6_657_031.7031, 4_999_744.4022]
          ]
        ]
      ]
    },
    properties: {
      shape_area: 100,
      is_enabled: true
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_657_079.1077, 4_999_771.6994],
            [6_657_101.6316, 4_999_772.7432],
            [6_657_077.0389, 4_999_745.0071],
            [6_657_079.1077, 4_999_771.6994]
          ]
        ]
      ]
    },
    properties: {
      shape_area: 200,
      is_enabled: true
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_657_016.7109, 4_999_722.3024],
            [6_657_116.4014, 4_999_724.7314],
            [6_657_115.5985, 4_999_719.8615],
            [6_657_016.1702, 4_999_718.2005],
            [6_657_016.7109, 4_999_722.3024]
          ]
        ]
      ]
    },
    properties: {
      shape_area: 300,
      is_enabled: true
    }
  }
];
