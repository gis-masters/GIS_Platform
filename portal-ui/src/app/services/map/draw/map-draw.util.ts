import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { SingleDrawGeometryType } from './map-draw.models';

export function toDrawGeometry(baseType: GeometryType | undefined): SingleDrawGeometryType {
  switch (baseType) {
    case GeometryType.LINE_STRING:
    case GeometryType.MULTI_LINE_STRING: {
      return GeometryType.MULTI_LINE_STRING;
    }
    case GeometryType.POLYGON:
    case GeometryType.MULTI_POLYGON:
    case GeometryType.GEOMETRY_COLLECTION: {
      return GeometryType.POLYGON;
    }
    case GeometryType.POINT:
    case GeometryType.MULTI_POINT: {
      return GeometryType.POINT;
    }
    case GeometryType.CIRCLE: {
      return GeometryType.CIRCLE;
    }
    default: {
      throw new Error(`Добавление объекта с геометрией: '${baseType}' не поддерживается`);
    }
  }
}
