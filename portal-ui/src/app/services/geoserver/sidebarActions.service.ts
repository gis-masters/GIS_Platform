import { CrgVectorLayer, CrgLayerType, CrgLayer } from '../crg/projects.models';

import { getFeatureType } from './featuretypes.service';
import { getProjection, olProjection, transform } from './projections.service';

import { isEqual } from 'lodash';
import { mapService } from '../map/map.service';
import { Toast } from '../../components/Toast/Toast';
import { getLayerCoverage } from './layers.service';

export async function focusToLayer(entity: CrgLayer): Promise<void> {
  try {
    const { nativeBoundingBox } =
      entity.type === CrgLayerType.VECTOR
        ? await getFeatureType(entity as CrgVectorLayer)
        : await getLayerCoverage(entity);

    const { maxx, maxy, minx, miny, crs } = nativeBoundingBox;

    const crsStr = typeof crs === 'string' ? crs : crs.$;
    const projection = getProjection(crsStr);

    if (isEqual([maxx, maxy, minx, miny], [-1, -1, 0, 0])) {
      showGoToBoundingBoxError();

      return;
    }

    const [x1, y1] = transform(projection, olProjection, [minx, miny]);
    const [x2, y2] = transform(projection, olProjection, [maxx, maxy]);

    if (Number.isNaN(x1) || Number.isNaN(x2) || Number.isNaN(y1) || Number.isNaN(y2)) {
      showGoToBoundingBoxError();

      return;
    }

    mapService.fitToBbox([x1, y1, x2, y2], [50, 50, 50, 50]);
  } catch {
    showGoToBoundingBoxError();
  }
}

function showGoToBoundingBoxError() {
  const message = 'Не удалось перейти к слою';
  Toast.warn(message);
  Toast.error({ message, suppress: true });
}
