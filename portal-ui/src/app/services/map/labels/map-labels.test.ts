import { describe, expect, test } from '@jest/globals';
import Polygon from 'ol/geom/Polygon';

import { UnitsOfAreaMeasurement } from '../../util/open-layers.util';
import { getFeatureArea } from './map-labels.util';

const EPSG7829testCoordinates: number[][] = [
  [4_962_924.38, 5_202_797.09],
  [4_962_754.54, 5_203_303.62],
  [4_962_727.46, 5_203_294.46],
  [4_962_694.71, 5_203_277.1],
  [4_962_690.44, 5_203_273.9],
  [4_962_866.08, 5_202_750.09]
];

const EPSG3857Coordinates: number[][] = [
  [3_458_682.5622, 5_934_914.1676],
  [3_458_393.0745, 5_935_641.0036],
  [3_458_354.3435, 5_935_625.3599],
  [3_458_308.0225, 5_935_597.2514],
  [3_458_302.0605, 5_935_592.2166],
  [3_458_601.4376, 5_934_840.594]
];

describe('Проверка площадей одного объекта в разных системах координат', () => {
  test('Проверка площади объекта в системе координат EPSG:7829', () => {
    const polygon = new Polygon([EPSG7829testCoordinates]);

    const [value] = getFeatureArea({
      geometry: polygon,
      units: UnitsOfAreaMeasurement.HECTARE,
      precision: 4
    });

    expect(value).toEqual(3.8279);
  });

  test('Проверка площадей одного объекта в разных системах координат EPSG:3857', () => {
    const polygon = new Polygon([EPSG3857Coordinates]);

    const [value] = getFeatureArea({
      geometry: polygon,
      units: UnitsOfAreaMeasurement.HECTARE,
      projection: 'EPSG:3857',
      precision: 4
    });

    expect(value).toEqual(3.807);
  });
});
