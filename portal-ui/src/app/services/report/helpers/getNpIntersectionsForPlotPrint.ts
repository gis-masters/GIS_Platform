import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type IntersectionPrintItem } from '../report.models';
import { resolveLayersBySchema } from './resolveLayersBySchema';

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
  const matchedLayers = await resolveLayersBySchema(NP_LAYER_SCHEMA_NAME);

  if (!matchedLayers.length) {
    return {
      ok: false,
      message: `В проекте нет векторного слоя по схеме "${NP_LAYER_SCHEMA_NAME}". Добавьте слой в проект.`
    };
  }

  if (matchedLayers.length > 1) {
    return {
      ok: false,
      message: `В проекте несколько слоев по схеме "${NP_LAYER_SCHEMA_NAME}". Оставьте один такой слой в проекте.`
    };
  }

  const npLayer = matchedLayers[0];

  if (!npLayer.complexName) {
    return {
      ok: false,
      message: `У слоя по схеме "${NP_LAYER_SCHEMA_NAME}" (id ${npLayer.id}) не задан complexName.`
    };
  }

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
