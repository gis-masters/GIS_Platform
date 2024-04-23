import { pointOnFeature } from '@turf/turf';

import { getProjection, olProjection, transform } from '../../geoserver/projections.service';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../gis/layers/layers.utils';
import { mapLabelsService } from '../../map/map-labels.service';

export function numberFeaturesOnMap(wfsFeatures: WfsFeature[]): void {
  for (const [i, wfsFeature] of wfsFeatures.entries()) {
    const { geometry } = wfsFeature;
    const layer = getLayerByFeatureInCurrentProject(wfsFeature);
    if (geometry && layer) {
      const point = pointOnFeature({ ...wfsFeature, geometry });
      const coordinate = transform(getProjection(layer.nativeCRS), olProjection, point.geometry.coordinates);

      mapLabelsService.addPrintLabel(coordinate, i + 1);
    }
  }

  mapLabelsService.showPrintLabels();
}

export function hideNumberFeaturesOnMap(): void {
  mapLabelsService.hidePrintLabels();
}
