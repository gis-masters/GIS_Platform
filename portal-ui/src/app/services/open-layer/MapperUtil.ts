import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import { MultiLineString, MultiPolygon, Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';

import { WfsFeature, WfsGeometry } from '../geoserver/wfs.models';
import { Toast } from '../../components/Toast/Toast';

export class MapperUtil {
  /**
   * Из {@link WfsFeature} формируем OpenLayer фичу {@link Feature}
   */
  public static mapWfsFeatureToFeature(wfsFeature: WfsFeature, supressError?: boolean): Feature | undefined {
    if (!wfsFeature.geometry) {
      if (!supressError) {
        Toast.error({
          message: 'Ошибка отображения объекта',
          details: `ID: ${wfsFeature.id}.
                    Нет геометрии.`
        });
      }

      return;
    }
    return new Feature({
      geometry: this.mapFwsGeometryToGeometry(wfsFeature.geometry as WfsGeometry<Coordinate>)
    });
  }

  /**
   * Из {@link WfsGeometry} формируем OpenLayer {@link Geometry}
   */
  public static mapFwsGeometryToGeometry(wfsGeometry: WfsGeometry<Coordinate>): Geometry | undefined | void {
    if (!wfsGeometry) {
      Toast.error('Некорректная геометрия');

      return;
    }

    switch (wfsGeometry.type) {
      case GeometryType.POINT:
        return new Point(wfsGeometry.coordinates);
      case GeometryType.MULTI_POLYGON:
        return new MultiPolygon(wfsGeometry.coordinates);
      case GeometryType.MULTI_LINE_STRING:
        return new MultiLineString(wfsGeometry.coordinates);
      default:
        Toast.error(`Not supported geometry type: ${wfsGeometry.type}`);
    }
  }
}
