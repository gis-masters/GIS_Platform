import { isEqual } from 'lodash';
import { AxiosError } from 'axios';

import { services } from '../services';
import { mapService } from '../map/map.service';
import { Toast } from '../../components/Toast/Toast';
import { isVectorFromFile } from '../gis/layers/layers.utils';
import { CrgVectorLayer, CrgLayerType, CrgLayer } from '../gis/layers/layers.models';

import { recalculateBboxAndGetFeatureType } from './featuretypes.service';
import { getLayerCoverage } from './geoserverLayer/geoserverLayer.service';
import { getProjection, olProjection, transform } from './projections.service';

export async function focusToLayer(layer: CrgLayer): Promise<void> {
  try {
    const { nativeBoundingBox, srs } =
      layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type)
        ? await recalculateBboxAndGetFeatureType(layer as CrgVectorLayer)
        : await getLayerCoverage(layer);

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
  } catch (error) {
    const err = error as AxiosError;

    showGoToBoundingBoxError(err.message);
  }
}

function showGoToBoundingBoxError(reason?: string) {
  const message = 'Не удалось перейти к слою';

  services.logger.error(`${message}. Reason: ${reason}`);

  Toast.warn(message);
  Toast.error({ message, suppress: true });
}
