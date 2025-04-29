import { CrgLayerType, CrgVectorableLayer } from '../../gis/layers/layers.models';

export function isCrgVectorableLayer(obj: unknown): obj is CrgVectorableLayer {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const candidate = obj as CrgVectorableLayer;

  // Проверяем обязательные поля
  if (
    typeof candidate.id !== 'number' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.type !== 'string' ||
    typeof candidate.nativeCRS !== 'string' ||
    typeof candidate.tableName !== 'string'
  ) {
    return false;
  }

  // Проверяем, что тип является одним из допустимых для CrgVectorableLayer
  const validTypes = [CrgLayerType.VECTOR, CrgLayerType.DXF, CrgLayerType.MID, CrgLayerType.SHP, CrgLayerType.TAB];

  return !!validTypes.includes(candidate.type);
}
