import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { MultiLineString, MultiPolygon, Point } from 'ol/geom';

import { WfsFeature, WfsGeometry } from '../geoserver/wfs.service';
import { UsedGeometryType } from './GeometryType';
import { ToastError } from '../../components/ToastError/ToastError';

export class MapperUtil {
  /**
   * Из {@link WfsFeature} формируем OpenLayer фичу {@link Feature}
   */
  public static mapWfsFeatureToFeature(wfsFeature: WfsFeature, supressError?: boolean): Feature | undefined {
    if (!wfsFeature.geometry) {
      if (!supressError) {
        ToastError.show({
          message: 'Ошибка: нет геометрии',
          details: `type: ${wfsFeature.type};
                    id: ${wfsFeature.id};
                    geometry_name: ${wfsFeature.geometry_name};`
        });
      }

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
      ToastError.show({message: 'Некорректная геометрия'});

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
        ToastError.show({message: `Not supported geometry type: ${wfsGeometry.type}`});
    }
  }
}
