import { isNumber } from 'lodash';

import { isArrayOf } from '../../util/typeGuards/isArrayOf';

export const validationWellKnownFormulas: Record<string, (value: unknown) => string[] | undefined> = {
  bboxJson3857: (value: unknown): string[] | undefined => {
    const invalidFormatMessage = ['Некорректное значение. Должно быть в формате [x1,y1,x2,y2]'];

    // на пустое значение проверяет валидатор required, поэтому здесь не нужно возвращать ошибку
    if (!value) {
      return;
    }

    if (typeof value !== 'string') {
      return invalidFormatMessage;
    }

    try {
      const bbox = JSON.parse(value) as unknown;
      if (!isArrayOf(bbox, isNumber) || bbox.length !== 4) {
        return invalidFormatMessage;
      }

      const [x1, y1, x2, y2] = bbox;
      const [minX, minY, maxX, maxY] = [-20_037_508.34, -20_048_966.1, 20_037_508.34, 20_048_966.1];

      if (x1 >= x2 || y1 >= y2) {
        return ['Некорректный bbox: x1 должен быть меньше x2, y1 меньше y2'];
      }

      if (x1 < minX || x1 > maxX || x2 < minX || x2 > maxX || y1 < minY || y1 > maxY || y2 < minY || y2 > maxY) {
        return ['Bbox выходит за пределы проекции EPSG:3857'];
      }
    } catch {
      return invalidFormatMessage;
    }
  }
};
