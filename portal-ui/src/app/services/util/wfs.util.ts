import { WFS } from 'ol/format';
import { Point } from 'ol/geom';
import { intersects } from 'ol/format/filter';
import MultiPolygon from 'ol/geom/MultiPolygon';

import { olProjection } from '../geoserver/projections.service';
import { MapSelectionTypes } from '../../stores/Sidebars.store';
import { Mime } from './Mime';

export function makeXmlIntersect(featuresComplexName: string[], coordinates: [number, number]): string {
  const featureRequest = new WFS().writeGetFeature({
    featureTypes: featuresComplexName,
    outputFormat: Mime.JSON,
    filter: intersects('shape', new Point(coordinates)),
    featureNS: '',
    featurePrefix: ''
  });

  return new XMLSerializer().serializeToString(featureRequest);
}

export function makeXmlPolygonIntersect(
  featuresComplexName: string[],
  polygon: MultiPolygon,
  srsName: string,
  featuresLimit: MapSelectionTypes
): string {
  const featureRequest = new WFS().writeGetFeature({
    srsName,
    featureTypes: featuresComplexName,
    outputFormat: Mime.JSON,
    filter: intersects('shape', polygon, olProjection.id),
    featureNS: '',
    featurePrefix: '',
    maxFeatures: featuresLimit !== MapSelectionTypes.REMOVE ? 100 : undefined
  });

  return new XMLSerializer().serializeToString(featureRequest);
}
