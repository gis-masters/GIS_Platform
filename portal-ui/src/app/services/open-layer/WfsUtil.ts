import WFS from 'ol/format/WFS';
import Point from 'ol/geom/Point.js';
import {intersects, and} from 'ol/format/filter';

export class WfsUtil {

  public static makeXmlIntersect(featuresComplexName: string[], coordinates: [number, number]): string {
    const featureRequest = new WFS().writeGetFeature({
      srsName: 'EPSG:3857',
      featureTypes: featuresComplexName,
      outputFormat: 'application/json',
      filter: intersects('shape', new Point(coordinates))
    });

    return new XMLSerializer().serializeToString(featureRequest);
  }
}
