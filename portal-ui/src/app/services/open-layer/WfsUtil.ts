import { WFS } from 'ol/format';
import { Point } from 'ol/geom';
import { intersects } from 'ol/format/filter';
import MultiPolygon from 'ol/geom/MultiPolygon';

import { olProjection } from '../geoserver/projections.service';

export function makeXmlIntersect(featuresComplexName: string[], coordinates: [number, number]): string {
  const featureRequest = new WFS().writeGetFeature({
    featureTypes: featuresComplexName,
    outputFormat: 'application/json',
    filter: intersects('shape', new Point(coordinates)),
    featureNS: '',
    featurePrefix: ''
  });

  return new XMLSerializer().serializeToString(featureRequest);
}

export function makeXmlPolygonIntersect(featuresComplexName: string[], polygon: MultiPolygon, srsName: string): string {
  const featureRequest = new WFS().writeGetFeature({
    srsName,
    featureTypes: featuresComplexName,
    outputFormat: 'application/json',
    filter: intersects('shape', polygon, olProjection.id),
    featureNS: '',
    featurePrefix: ''
  });

  return new XMLSerializer().serializeToString(featureRequest);
}

  // Из BaseLayer достанем название источника
export function getComplexLayerName(baseLayer: any): string | undefined {
  const source = baseLayer.getSource();
  if (source && source.params_ && source.params_['LAYERS']) {
    return source.params_['LAYERS'];
  } else {
    return undefined;
  }
}
