import { isEqual } from 'lodash';

import { mapService } from '../map/map.service';
import { Toast } from '../../components/Toast/Toast';
import { getLayerCoverage } from './geoserverLayer/geoserverLayer.service';
import { CrgVectorLayer, CrgLayerType, CrgLayer } from '../gis/layers/layers.models';

import { getFeatureType } from './featuretypes.service';
import { getProjection, olProjection, transform } from './projections.service';

export async function focusToLayer(entity: CrgLayer): Promise<void> {
  try {
    const { nativeBoundingBox, srs } =
      entity.type === CrgLayerType.VECTOR || entity.type === CrgLayerType.VECTOR_FROM_FILE
        ? await getFeatureType(entity as CrgVectorLayer)
        : await getLayerCoverage(entity);

    const { maxx, maxy, minx, miny } = nativeBoundingBox;
    const projection = getProjection(srs);

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
