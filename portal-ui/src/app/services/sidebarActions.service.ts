import { AxiosError } from 'axios';
import { isEqual } from 'lodash';

import { Toast } from '../components/Toast/Toast';
import { getOlProjection, getProjectionByCode } from './data/projections/projections.service';
import { transform } from './data/projections/projections.util';
import { recalculateBboxAndGetCoverage } from './geoserver/coverages/coverages.service';
import { recalculateBboxAndGetFeatureType } from './geoserver/featureType/featureType.service';
import { CrgLayer, CrgLayerType, CrgVectorLayer } from './gis/layers/layers.models';
import { isVectorFromFile } from './gis/layers/layers.utils';
import { mapService } from './map/map.service';
import { services } from './services';

export async function focusToLayer(layer: CrgLayer): Promise<void> {
  try {
    const { latLonBoundingBox } =
      layer.type === CrgLayerType.VECTOR || isVectorFromFile(layer.type)
        ? await recalculateBboxAndGetFeatureType(layer as CrgVectorLayer)
        : await recalculateBboxAndGetCoverage(layer);

    const { maxx, maxy, minx, miny } = latLonBoundingBox;
    const geoserverProjection = await getProjectionByCode('EPSG:4326');
    const olProjection = await getOlProjection();

    if (isEqual([maxx, maxy, minx, miny], [-1, -1, 0, 0]) || !geoserverProjection) {
      showGoToBoundingBoxError();

      return;
    }

    const [x1, y1] = transform(geoserverProjection, olProjection, [minx, miny]);
    const [x2, y2] = transform(geoserverProjection, olProjection, [maxx, maxy]);

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
