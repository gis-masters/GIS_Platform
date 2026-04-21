import { describe, expect, test } from '@jest/globals';

import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { buildCoordinatesList } from './buildCoordinatesList';

describe('buildCoordinatesList', () => {
  test('возвращает пустой массив при отсутствии геометрии', () => {
    expect(buildCoordinatesList()).toStrictEqual([]);
  });

  test('Point — один чанк с одной координатой', () => {
    const result = buildCoordinatesList({
      type: GeometryType.POINT,
      coordinates: [10, 20]
    });

    expect(result).toStrictEqual([{ coordinates: [{ num: 1, x: 10, y: 20 }] }]);
  });

  test('LineString — один чанк со сквозной нумерацией', () => {
    const result = buildCoordinatesList({
      type: GeometryType.LINE_STRING,
      coordinates: [
        [1, 2],
        [3, 4],
        [5, 6]
      ]
    });

    expect(result).toStrictEqual([
      {
        coordinates: [
          { num: 1, x: 1, y: 2 },
          { num: 2, x: 3, y: 4 },
          { num: 3, x: 5, y: 6 }
        ]
      }
    ]);
  });

  test('MultiPoint — аналогично LineString', () => {
    const result = buildCoordinatesList({
      type: GeometryType.MULTI_POINT,
      coordinates: [
        [10, 20],
        [30, 40]
      ]
    });

    expect(result).toStrictEqual([
      {
        coordinates: [
          { num: 1, x: 10, y: 20 },
          { num: 2, x: 30, y: 40 }
        ]
      }
    ]);
  });

  test('Polygon — замыкающая точка получает номер первой точки контура', () => {
    const result = buildCoordinatesList({
      type: GeometryType.POLYGON,
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
          [1, 2]
        ]
      ]
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe(undefined);

    const coords = result[0].coordinates;
    expect(coords[0]).toStrictEqual({ num: 1, x: 1, y: 2 });
    expect(coords.at(-1)).toStrictEqual({ num: 1, x: 1, y: 2 });
  });

  test('Polygon с двумя кольцами — сквозная нумерация между кольцами', () => {
    const result = buildCoordinatesList({
      type: GeometryType.POLYGON,
      coordinates: [
        [
          [1, 2],
          [3, 4],
          [5, 6],
          [1, 2]
        ],
        [
          [7, 8],
          [9, 10],
          [7, 8]
        ]
      ]
    });

    expect(result).toHaveLength(2);

    const secondChunkCoords = result[1].coordinates;
    expect(secondChunkCoords[0].num).toBe(4);
  });

  test('MultiLineString — чанки с заголовками «Линия» и сквозной нумерацией', () => {
    const result = buildCoordinatesList({
      type: GeometryType.MULTI_LINE_STRING,
      coordinates: [
        [
          [1, 2],
          [3, 4]
        ],
        [
          [5, 6],
          [7, 8]
        ]
      ]
    });

    expect(result).toHaveLength(2);
    expect(result[0].title).toContain('Линия');
    expect(result[1].title).toContain('Линия');

    expect(result[1].coordinates[0].num).toBe(3);
  });

  test('MultiPolygon (один полигон, одно кольцо) — title undefined', () => {
    const result = buildCoordinatesList({
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [1, 2],
            [3, 4],
            [5, 6],
            [1, 2]
          ]
        ]
      ]
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBeUndefined();

    const coords = result[0].coordinates;
    expect(coords.at(-1)?.num).toBe(1);
  });

  test('MultiPolygon (несколько полигонов) — заголовки содержат номер полигона', () => {
    const result = buildCoordinatesList({
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [1, 2],
            [3, 4],
            [1, 2]
          ]
        ],
        [
          [
            [5, 6],
            [7, 8],
            [5, 6]
          ]
        ]
      ]
    });

    expect(result).toHaveLength(2);
    expect(result[0].title).toContain('Полигон 1');
    expect(result[1].title).toContain('Полигон 2');

    expect(result[1].coordinates[0].num).toBe(3);
  });

  test('MultiPolygon (один полигон, несколько колец) — заголовки с номерами контуров', () => {
    const result = buildCoordinatesList({
      type: GeometryType.MULTI_POLYGON,
      coordinates: [
        [
          [
            [1, 2],
            [3, 4],
            [1, 2]
          ],
          [
            [5, 6],
            [7, 8],
            [5, 6]
          ]
        ]
      ]
    });

    expect(result).toHaveLength(2);
    expect(result[0].title).toContain('Контур 1');
    expect(result[1].title).toContain('Контур 2');
  });
});
