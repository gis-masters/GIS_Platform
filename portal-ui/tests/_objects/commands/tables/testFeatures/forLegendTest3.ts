import { GeometryType, NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

export const forLegendTest3: NewWfsFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [6_656_734.0976, 4_999_904.6083],
            [6_656_726.6525, 4_999_960.0624],
            [6_656_755.1203, 4_999_959.937],
            [6_656_743.7507, 4_999_905.3968],
            [6_656_734.0976, 4_999_904.6083]
          ]
        ]
      ]
    },
    properties: {
      linetype: 'Новое замечание'
    }
  }
];
