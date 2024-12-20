import { pointOnFeature } from '@turf/turf';

import { getOlProjection, getProjectionByCode } from '../../data/projections/projections.service';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { mapLabelsService } from '../../map/labels/map-labels.service';
import { transform } from '../../util/coordinates-transform.util';

export async function numberFeaturesOnMap(wfsFeatures: WfsFeature[]): Promise<void> {
  for (const [i, wfsFeature] of wfsFeatures.entries()) {
    const { geometry } = wfsFeature;
    const layer = getLayerByFeatureInCurrentProject(wfsFeature);

    if (layer) {
      const projection = await getProjectionByCode(layer.nativeCRS);
      const olProjection = await getOlProjection();

      if (geometry && projection && olProjection) {
        const point = pointOnFeature({ ...wfsFeature, geometry });
        const coordinate = transform(point.geometry.coordinates, projection, olProjection);

        mapLabelsService.addPrintLabel(coordinate, i + 1);
      }
    }
  }

  mapLabelsService.showPrintLabels();
}

export function hideNumberFeaturesOnMap(): void {
  mapLabelsService.hidePrintLabels();
}
