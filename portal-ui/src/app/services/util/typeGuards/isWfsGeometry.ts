import { GeometryType, WfsGeometry } from '../../geoserver/wfs/wfs.models';

export function isWfsGeometry(obj: unknown): obj is WfsGeometry {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const candidate = obj as WfsGeometry;

  // Проверяем обязательные поля
  if (typeof candidate.type !== 'string') {
    return false;
  }

  // Проверяем, что тип является одним из GeometryType
  if (!Object.values(GeometryType).includes(candidate.type as GeometryType)) {
    return false;
  }

  // Проверяем наличие coordinates
  return !!('coordinates' in candidate || 'geometries' in candidate);
}
