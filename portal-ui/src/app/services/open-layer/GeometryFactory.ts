import Point from 'ol/geom/Point.js';
import SimpleGeometry from 'ol/geom/SimpleGeometry.js';
import MultiLineString from 'ol/geom/MultiLineString.js';
import {WfsFeature} from '../geoserver/wfs.service';

export class GeometryFactory {

  public static getObject(feature: WfsFeature): SimpleGeometry {
    if (!feature || !feature.geometry) {
      throw new Error('feature is required');
    }

    if (feature.geometry.type === 'Point') {
      return new Point(feature.geometry.coordinates);
    } else if (feature.geometry.type === 'MultiLineString') {
      return new MultiLineString(feature.geometry.coordinates);
    } else {
      console.warn('Not supported geometry type: ', feature.geometry);

      return null;
    }
  }
}
