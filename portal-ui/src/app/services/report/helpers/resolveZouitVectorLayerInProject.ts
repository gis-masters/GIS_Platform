import { resolveSingleLayerBySchema, type ResolveSingleLayerBySchemaResult } from './resolveLayersBySchema';

export const ZOUIT_LAYER_SCHEMA_NAME = 'zouit_pro';

/**
 * Слой ЗОУИТ в составе проекта по схеме zouit_pro (видимость на карте не важна).
 */
export async function resolveZouitVectorLayerInProject(): Promise<ResolveSingleLayerBySchemaResult> {
  return resolveSingleLayerBySchema(ZOUIT_LAYER_SCHEMA_NAME);
}
