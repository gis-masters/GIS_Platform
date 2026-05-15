import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type OksIntersectionPrintItem } from './oksIntersectionPrint.models';
import { resolveZouitVectorLayerInProject } from './resolveZouitVectorLayerInProject';

export type GetZouitIntersectionsForPlotPrintResult =
  | { ok: true; items: OksIntersectionPrintItem[] }
  | { ok: false; message: string };

export type GetZouitIntersectionsForPlotPrintOptions = {
  skipAreaComputation?: boolean;
};

/**
 * Пересечения объекта участка со слоем ЗОУИТ из проекта (слой может быть выключен в легенде).
 */
export async function getZouitIntersectionsForPlotPrint(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer,
  options?: GetZouitIntersectionsForPlotPrintOptions
): Promise<GetZouitIntersectionsForPlotPrintResult> {
  const zouitResolve = resolveZouitVectorLayerInProject();

  if (!zouitResolve.ok) {
    return { ok: false, message: zouitResolve.message };
  }

  try {
    const wfsItems = await getWfsIntersectionsForFeature(feature, sourceLayer, zouitResolve.layer, {
      skipMaxFeaturesLimit: true,
      skipAreaComputation: options?.skipAreaComputation ?? false
    });

    const items: OksIntersectionPrintItem[] = wfsItems.map(item => ({
      layer: zouitResolve.layer,
      type: item.geometryType,
      feature: item.feature,
      intersectionArea: item.intersectionArea,
      intersectionAreaPercent: item.intersectionAreaPercent
    }));

    return { ok: true, items };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка при получении пересечений со слоем ЗОУИТ';

    return { ok: false, message };
  }
}
