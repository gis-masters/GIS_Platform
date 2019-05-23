import WFS from 'ol/format/WFS';
import Point from 'ol/geom/Point.js';
import {intersects} from 'ol/format/filter';
import MultiPolygon from 'ol/geom/MultiPolygon.js';

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

  public static makeXmlPolygonIntersect(featuresComplexName: string[], polygon: MultiPolygon): string {
    const featureRequest = new WFS().writeGetFeature({
      srsName: 'EPSG:3857',
      featureTypes: featuresComplexName,
      outputFormat: 'application/json',
      filter: intersects('shape', polygon)
    });

    return new XMLSerializer().serializeToString(featureRequest);
  }

}
