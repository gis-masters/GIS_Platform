import {Feature} from 'ol';
import Geometry from 'ol/geom/Geometry';
import {WfsFeature, WfsGeometry} from '../geoserver/wfs.service';
import {MultiLineString, MultiPolygon, Point} from 'ol/geom';
import {UsedGeometryType} from './GeometryType';

export class MapperUtil {

  /**
   * Из {@link WfsFeature} формируем OpenLayer фичу {@link Feature}
   */
  public static mapWfsFeatureToFeature(wfsFeature: WfsFeature): Feature | undefined {
    if (!wfsFeature.geometry) {
      console.warn('Where is geometry???', wfsFeature);
      return;
    }

    return new Feature({
      geometry: this.mapFwsGeometryToGeometry(wfsFeature.geometry)
    });
  }

  /**
   * Из {@link WfsGeometry} формируем OpenLayer {@link Geometry}
   */
  public static mapFwsGeometryToGeometry(wfsGeometry: WfsGeometry): Geometry | undefined {
    if (!wfsGeometry) {
      console.warn('Incorrect wfsGeometry', wfsGeometry);
      return;
    }

    switch (wfsGeometry.type) {
      case UsedGeometryType.POINT:
        return new Point(wfsGeometry.coordinates);
      case UsedGeometryType.MULTIPOLYGON:
        return new MultiPolygon(wfsGeometry.coordinates);
      case UsedGeometryType.MULTILINE_STRING:
        return new MultiLineString(wfsGeometry.coordinates);
      default:
        console.warn('Not supported geometry type: ', wfsGeometry);
    }
  }

}
