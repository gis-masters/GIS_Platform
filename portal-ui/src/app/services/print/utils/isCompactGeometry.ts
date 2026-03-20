import { GeometryType, type WfsGeometry } from '../../geoserver/wfs/wfs.models';

export function isCompactGeometry(geometry: WfsGeometry | undefined, maxCoordinatesInChunk: number): boolean {
  if (!geometry) {
    return false;
  }

  const { coordinates, type: geometryType } = geometry;

  if (geometryType === GeometryType.POINT) {
    return true;
  }

  if (geometryType === GeometryType.MULTI_POINT || geometryType === GeometryType.LINE_STRING) {
    return coordinates.length <= maxCoordinatesInChunk;
  }

  if (geometryType === GeometryType.POLYGON || geometryType === GeometryType.MULTI_LINE_STRING) {
    return coordinates.length <= 1 && coordinates.every(chunk => chunk.length <= maxCoordinatesInChunk);
  }

  if (geometryType === GeometryType.MULTI_POLYGON) {
    return (
      coordinates.length <= 1 &&
      coordinates.every(polygon => polygon.length <= 1 && polygon.every(ring => ring.length <= maxCoordinatesInChunk))
    );
  }

  return true;
}
