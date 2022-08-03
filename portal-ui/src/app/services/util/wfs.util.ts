import { WFS } from 'ol/format';
import { intersects } from 'ol/format/filter';
import MultiPolygon from 'ol/geom/MultiPolygon';

import {} from '../../stores/Sidebars.store';
import { MapSelectionTypes, mapStore, SELECTING_FEATURES_LIMIT } from '../../stores/Map.store';
import { olProjection } from '../geoserver/projections.service';
import { Mime } from './Mime';

export function makeXmlPolygonIntersect(
  featuresComplexName: string[],
  polygon: MultiPolygon,
  srsName: string,
  selectionType: MapSelectionTypes
): string {
  const featureRequest = new WFS().writeGetFeature({
    srsName,
    featureTypes: featuresComplexName,
    outputFormat: Mime.JSON,
    filter: intersects('shape', polygon, olProjection.id),
    featureNS: '',
    featurePrefix: '',
    maxFeatures:
      selectionType !== MapSelectionTypes.REMOVE
        ? Math.max(
            SELECTING_FEATURES_LIMIT - (selectionType === MapSelectionTypes.ADD ? mapStore.selectedFeatures.length : 0),
            1
          )
        : undefined
  });

  return new XMLSerializer().serializeToString(featureRequest);
}
