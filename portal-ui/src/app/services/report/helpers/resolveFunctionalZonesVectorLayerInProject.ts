import { resolveSingleLayerBySchema, type ResolveSingleLayerBySchemaResult } from './resolveLayersBySchema';

export const FUNCTIONAL_ZONES_LAYER_SCHEMA_NAME = 'functionalzone_fgis';

/**
 * Слой функциональных зон в составе проекта по схеме functionalzone_fgis (видимость на карте не важна).
 */
export async function resolveFunctionalZonesVectorLayerInProject(): Promise<ResolveSingleLayerBySchemaResult> {
  return resolveSingleLayerBySchema(FUNCTIONAL_ZONES_LAYER_SCHEMA_NAME);
}
