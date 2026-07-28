import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type IntersectionPrintItem } from '../report.models';
import { resolveSingleLayerBySchemaTemplate } from './resolveLayersBySchema';

/** Имя схемы векторной таблицы границ населённых пунктов (Schema.name). */
export const NP_LAYER_SCHEMA_NAME = 'admenp_fgis';

export type GetNpIntersectionsForPlotPrintResult =
  | { ok: true; items: IntersectionPrintItem[] }
  | { ok: false; message: string };

/**
 * Пересечения объекта участка со слоем границ населённых пунктов (схема admenp_fgis).
 */
export async function getNpIntersectionsForPlotPrint(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer
): Promise<GetNpIntersectionsForPlotPrintResult> {
  const npResolve = await resolveSingleLayerBySchemaTemplate(NP_LAYER_SCHEMA_NAME);

  if (!npResolve.ok) {
    return { ok: false, message: npResolve.message };
  }

  const npLayer = npResolve.layer;

  try {
    const wfsItems = await getWfsIntersectionsForFeature(feature, sourceLayer, npLayer, {
      skipMaxFeaturesLimit: true
    });

    const items: IntersectionPrintItem[] = wfsItems.map(item => ({
      layer: npLayer,
      type: item.geometryType,
      feature: item.feature,
      intersectionArea: item.intersectionArea,
      intersectionAreaPercent: item.intersectionAreaPercent
    }));

    return { ok: true, items };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ошибка при получении пересечений со слоем границ населённых пунктов';

    return { ok: false, message };
  }
}
