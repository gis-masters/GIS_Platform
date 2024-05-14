import { pointOnFeature } from '@turf/turf';

import { getOlProjection, getProjectionByCrs } from '../../data/projection/projection.service';
import { transform } from '../../data/projection/projection.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { mapLabelsService } from '../../map/map-labels.service';

export async function numberFeaturesOnMap(wfsFeatures: WfsFeature[]): Promise<void> {
  for (const [i, wfsFeature] of wfsFeatures.entries()) {
    const { geometry } = wfsFeature;
    const layer = getLayerByFeatureInCurrentProject(wfsFeature);

    if (layer) {
      const projection = await getProjectionByCrs(layer.nativeCRS);
      const olProjection = await getOlProjection();

      if (geometry && projection && olProjection) {
        const point = pointOnFeature({ ...wfsFeature, geometry });
        const coordinate = transform(projection, olProjection, point.geometry.coordinates);

        mapLabelsService.addPrintLabel(coordinate, i + 1);
      }
    }
  }

  mapLabelsService.showPrintLabels();
}

export function hideNumberFeaturesOnMap(): void {
  mapLabelsService.hidePrintLabels();
}
