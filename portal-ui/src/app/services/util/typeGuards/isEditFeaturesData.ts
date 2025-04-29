import { EditFeatureMode, EditFeaturesData } from '../../map/a-map-mode/edit-feature/EditFeature.models';
import { isCrgVectorableLayer } from './isCrgVectorableLayer';
import { isWfsFeature } from './isWfsFeature';

export function isEditFeaturesData(obj: unknown): obj is EditFeaturesData {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const candidate = obj as EditFeaturesData;

  // Проверяем наличие обязательных полей
  if (!('features' in candidate) || !('mode' in candidate)) {
    return false;
  }

  // Проверяем, что features - это массив
  if (!Array.isArray(candidate.features)) {
    return false;
  }

  // Проверяем каждый feature в массиве
  for (const feature of candidate.features) {
    if (!isWfsFeature(feature)) {
      return false;
    }
  }

  // Проверяем, что mode - это валидное значение EditFeatureMode
  if (candidate.mode !== EditFeatureMode.multipleEdit && candidate.mode !== EditFeatureMode.single) {
    return false;
  }

  // Проверяем опциональное поле layer, если оно присутствует
  return !(candidate.layer !== undefined && !isCrgVectorableLayer(candidate.layer));
}
