import { GeometryType } from '../../geoserver/wfs/wfs.models';

/**
 * В момент добавления новых объектов и возникновении события 'drawend', объекты имеют один из этих типов геометрии.
 */
export type SingleDrawGeometryType =
  | GeometryType.POINT
  | GeometryType.MULTI_LINE_STRING
  | GeometryType.POLYGON
  | GeometryType.CIRCLE;
