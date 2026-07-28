import { type ResolveSingleLayerBySchemaResult, resolveSingleLayerBySchemaTemplate } from './resolveLayersBySchema';

export const FUNCTIONAL_ZONES_LAYER_SCHEMA_NAME = 'functionalzone_fgis_p';

/**
 * Слой функциональных зон в составе проекта по схеме functionalzone_fgis_p (видимость на карте не важна).
 */
export async function resolveFunctionalZonesVectorLayerInProject(): Promise<ResolveSingleLayerBySchemaResult> {
  return resolveSingleLayerBySchemaTemplate(FUNCTIONAL_ZONES_LAYER_SCHEMA_NAME);
}
