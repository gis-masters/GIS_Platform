import { describe, expect, test } from '@jest/globals';

import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { isCompactGeometry } from './isCompactGeometry';

describe('isCompactGeometry', () => {
  const MAX = 5;

  test('undefined геометрия — не компактная', () => {
    expect(isCompactGeometry(undefined, MAX)).toBe(false);
  });

  test('Point — всегда компактная', () => {
    expect(isCompactGeometry({ type: GeometryType.POINT, coordinates: [1, 2] }, MAX)).toBe(true);
    expect(isCompactGeometry({ type: GeometryType.POINT, coordinates: [1, 2] }, 0)).toBe(true);
  });

  describe('LineString', () => {
    test('количество точек в пределах лимита — компактная', () => {
      const geometry = {
        type: GeometryType.LINE_STRING as const,
        coordinates: Array.from({ length: MAX }, (_, i) => [i, i])
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(true);
    });

    test('количество точек превышает лимит — не компактная', () => {
      const geometry = {
        type: GeometryType.LINE_STRING as const,
        coordinates: Array.from({ length: MAX + 1 }, (_, i) => [i, i])
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });
  });

  describe('MultiPoint', () => {
    test('в пределах лимита — компактная', () => {
      const geometry = {
        type: GeometryType.MULTI_POINT as const,
        coordinates: [
          [1, 2],
          [3, 4]
        ]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(true);
    });

    test('превышает лимит — не компактная', () => {
      const geometry = {
        type: GeometryType.MULTI_POINT as const,
        coordinates: Array.from({ length: MAX + 1 }, (_, i) => [i, i])
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });
  });

  describe('Polygon', () => {
    test('одно кольцо в пределах лимита — компактная', () => {
      const geometry = {
        type: GeometryType.POLYGON as const,
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0]
          ]
        ]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(true);
    });

    test('одно кольцо превышает лимит — не компактная', () => {
      const ring = Array.from({ length: MAX + 1 }, (_, i) => [i, i]);
      const geometry = {
        type: GeometryType.POLYGON as const,
        coordinates: [ring]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });

    test('несколько колец — не компактная', () => {
      const ring = [
        [0, 0],
        [1, 0],
        [0, 0]
      ];
      const geometry = {
        type: GeometryType.POLYGON as const,
        coordinates: [ring, ring]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });
  });

  describe('MultiLineString', () => {
    test('одна линия в пределах лимита — компактная', () => {
      const geometry = {
        type: GeometryType.MULTI_LINE_STRING as const,
        coordinates: [
          [
            [0, 0],
            [1, 1]
          ]
        ]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(true);
    });

    test('несколько линий — не компактная', () => {
      const geometry = {
        type: GeometryType.MULTI_LINE_STRING as const,
        coordinates: [
          [
            [0, 0],
            [1, 1]
          ],
          [
            [2, 2],
            [3, 3]
          ]
        ]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });
  });

  describe('MultiPolygon', () => {
    test('один полигон, одно кольцо в пределах лимита — компактная', () => {
      const geometry = {
        type: GeometryType.MULTI_POLYGON as const,
        coordinates: [
          [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0]
            ]
          ]
        ]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(true);
    });

    test('один полигон, кольцо превышает лимит — не компактная', () => {
      const ring = Array.from({ length: MAX + 1 }, (_, i) => [i, i]);
      const geometry = {
        type: GeometryType.MULTI_POLYGON as const,
        coordinates: [[ring]]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });

    test('несколько полигонов — не компактная', () => {
      const ring = [
        [0, 0],
        [1, 0],
        [0, 0]
      ];
      const geometry = {
        type: GeometryType.MULTI_POLYGON as const,
        coordinates: [[ring], [ring]]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });

    test('один полигон, несколько колец — не компактная', () => {
      const ring = [
        [0, 0],
        [1, 0],
        [0, 0]
      ];
      const geometry = {
        type: GeometryType.MULTI_POLYGON as const,
        coordinates: [[ring, ring]]
      };
      expect(isCompactGeometry(geometry, MAX)).toBe(false);
    });
  });
});
