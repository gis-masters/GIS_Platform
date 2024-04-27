import { pointOnFeature } from '@turf/turf';

import { getEpsgByCrs, getOlEpsg } from '../../data/epsg/epsg.service';
import { transform } from '../../data/epsg/epsg.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { mapLabelsService } from '../../map/map-labels.service';

export async function numberFeaturesOnMap(wfsFeatures: WfsFeature[]): Promise<void> {
  for (const [i, wfsFeature] of wfsFeatures.entries()) {
    const { geometry } = wfsFeature;
    const layer = getLayerByFeatureInCurrentProject(wfsFeature);

    if (layer) {
      const epsg = await getEpsgByCrs(layer.nativeCRS);
      const olEpsg = await getOlEpsg();

      if (geometry && epsg && olEpsg) {
        const point = pointOnFeature({ ...wfsFeature, geometry });
        const coordinate = transform(epsg, olEpsg, point.geometry.coordinates);

        mapLabelsService.addPrintLabel(coordinate, i + 1);
      }
    }
  }

  mapLabelsService.showPrintLabels();
}

export function hideNumberFeaturesOnMap(): void {
  mapLabelsService.hidePrintLabels();
}
