import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type OksIntersectionPrintItem } from './oksIntersectionPrint.models';
import { resolveVisibleOksLayers } from './resolveVisibleOksLayers';

export type GetOksIntersectionsForPlotPrintResult =
  | { ok: true; items: OksIntersectionPrintItem[] }
  | { ok: false; message: string };

export type GetOksIntersectionsForPlotPrintOptions = {
  /** Не считать площадь пересечения (turf), только объекты из WFS */
  skipAreaComputation?: boolean;
};

/**
 * Пересечения объекта участка со всеми видимыми слоями ОКС (areal / linear / point).
 */
export async function getOksIntersectionsForPlotPrint(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer,
  options?: GetOksIntersectionsForPlotPrintOptions
): Promise<GetOksIntersectionsForPlotPrintResult> {
  const oksResolve = await resolveVisibleOksLayers();

  if (!oksResolve.ok) {
    return { ok: false, message: oksResolve.message };
  }

  const items: OksIntersectionPrintItem[] = [];

  try {
    for (const targetLayer of Object.values(oksResolve.layers)) {
      const wfsItems = await getWfsIntersectionsForFeature(feature, sourceLayer, targetLayer, {
        skipMaxFeaturesLimit: true,
        skipAreaComputation: options?.skipAreaComputation ?? false
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
