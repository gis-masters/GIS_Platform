import { currentProject } from '../../../stores/CurrentProject.store';
import { type CrgVectorLayer, isVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';

/**
 * Векторные слои проекта, таблицы которых соответствуют схеме (Schema.name === schemaName).
 */
export async function resolveLayersBySchema(schemaName: string): Promise<CrgVectorLayer[]> {
  const matched: CrgVectorLayer[] = [];

  for (const layer of currentProject.vectorLayers) {
    if (!isVectorLayer(layer)) {
      continue;
    }

    if (!layer.dataset || !layer.resourceId) {
      continue;
    }

    try {
      const schema = await getLayerSchema(layer);
      if (schema?.name === schemaName) {
        matched.push(layer);
      }
    } catch {
      continue;
    }
  }

  return matched;
}
