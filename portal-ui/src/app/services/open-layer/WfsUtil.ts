import {WFS} from 'ol/format';
import {Point} from 'ol/geom';
import {intersects} from 'ol/format/filter';
import MultiPolygon from 'ol/geom/MultiPolygon';

export class WfsUtil {

  public static makeXmlIntersect(featuresComplexName: string[], coordinates: [number, number]): string {
    const featureRequest = new WFS().writeGetFeature({
      srsName: 'EPSG:3857',
      featureTypes: featuresComplexName,
      outputFormat: 'application/json',
      filter: intersects('shape', new Point(coordinates)),
      featureNS: '',
      featurePrefix: ''
    });

    return new XMLSerializer().serializeToString(featureRequest);
  }

  public static makeXmlPolygonIntersect(featuresComplexName: string[], polygon: MultiPolygon): string {
    const featureRequest = new WFS().writeGetFeature({
      srsName: 'EPSG:3857',
      featureTypes: featuresComplexName,
      outputFormat: 'application/json',
      filter: intersects('shape', polygon),
      featureNS: '',
      featurePrefix: ''
    });

    return new XMLSerializer().serializeToString(featureRequest);
  }

  // Из BaseLayer достанем название источника
  public static getComplexLayerName(baseLayer: any): string | undefined {
    const source = baseLayer.getSource();
    if (source && source.params_ && source.params_['LAYERS']) {
      return source.params_['LAYERS'];
    } else {
      return undefined;
    }
  }

}
