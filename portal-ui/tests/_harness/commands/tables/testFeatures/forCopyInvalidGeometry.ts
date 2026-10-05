import { GeometryType, type NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';

function square(x: number, y: number, note: string): NewWfsFeature {
  return {
    type: 'Feature',
    geometry: {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [x, y],
            [x + 200, y],
            [x + 200, y + 200],
            [x, y + 200],
            [x, y]
          ]
        ]
      ]
    },
    properties: { note }
  };
}

// Кольцо из бага 4291, самопересечение в точке [5185312.42 4974456.31]. Координаты в EPSG:3857.
const selfIntersection: NewWfsFeature = {
  type: 'Feature',
  geometry: {
    type: GeometryType.MULTI_POLYGON,
    coordinates: [
      [
        [
          [5_185_312.4737, 4_974_452.7769],
          [5_185_312.42, 4_974_456.31],
          [5_185_312.4737, 4_974_452.7769],
          [5_185_312.4737, 4_974_450.4923],
          [5_185_328.41, 4_974_450.49],
          [5_185_328.41, 4_974_450.49],
          [5_185_327.68, 4_974_447.6],
          [5_185_295.34, 4_974_296.4],
          [5_185_277.54, 4_974_296.46],
          [5_185_264.79, 4_974_223.1],
          [5_185_261.39, 4_974_211.15],
          [5_185_273.25, 4_974_031.18],
          [5_185_271.5268, 4_974_031.9313],
          [5_185_265.423, 4_974_018.0605],
          [5_185_217.7505, 4_974_038.7647],
          [5_185_152.8313, 4_974_037.72],
          [5_185_157.955, 4_974_253.2829],
          [5_185_171.7419, 4_974_454.6963],
          [5_185_312.4737, 4_974_452.7769]
        ]
      ]
    ]
  },
  properties: { note: 'самопересечение' }
};

export const copyInvalidGeometryValid1 = square(3_801_400, 5_608_600, 'валидный-1');

export const copyInvalidGeometrySelfIntersection = selfIntersection;

export const copyInvalidGeometryValid2 = square(3_801_800, 5_608_600, 'валидный-2');
