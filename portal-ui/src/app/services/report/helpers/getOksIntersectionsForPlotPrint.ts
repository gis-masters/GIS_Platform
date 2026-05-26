import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type IntersectionPrintItem } from '../report.models';
import { resolveOksLayersBySchema } from './resolveOksLayersBySchema';

export type GetOksIntersectionsForPlotPrintResult =
  | { ok: true; items: IntersectionPrintItem[] }
  | { ok: false; message: string };

/**
 * Пересечения объекта участка со слоями ОКС из проекта (areal / linear / point).
 */
export async function getOksIntersectionsForPlotPrint(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer
): Promise<GetOksIntersectionsForPlotPrintResult> {
  const oksResolve = await resolveOksLayersBySchema();

  if (!oksResolve.ok) {
    return { ok: false, message: oksResolve.message };
  }

  const items: IntersectionPrintItem[] = [];

  try {
    for (const targetLayer of Object.values(oksResolve.layers)) {
      const wfsItems = await getWfsIntersectionsForFeature(feature, sourceLayer, targetLayer, {
        skipMaxFeaturesLimit: true
      });

      for (const item of wfsItems) {
        items.push({
          layer: targetLayer,
          type: item.geometryType,
          feature: item.feature,
          intersectionArea: item.intersectionArea,
          intersectionAreaPercent: item.intersectionAreaPercent
        });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при получении пересечений с ОКС';

    return { ok: false, message };
  }

  return { ok: true, items };
}
