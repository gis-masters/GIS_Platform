import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { isWfsGeometry } from './isWfsGeometry';

export function isWfsFeature(obj: unknown): obj is WfsFeature {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const candidate = obj as WfsFeature;

  // Проверяем обязательные поля
  if (
    typeof candidate.type !== 'string' ||
    candidate.type !== 'Feature' ||
    typeof candidate.id !== 'string' ||
    typeof candidate.properties !== 'object'
  ) {
    return false;
  }

  // Проверяем опциональное поле geometry, если оно присутствует
  return !(candidate.geometry !== undefined && !isWfsGeometry(candidate.geometry));
}
