import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type IntersectionPrintItem } from '../report.models';
import { resolveZouitVectorLayerInProject } from './resolveZouitVectorLayerInProject';

export type GetZouitIntersectionsForPlotPrintResult =
  | { ok: true; items: IntersectionPrintItem[] }
  | { ok: false; message: string };

/**
 * Пересечения объекта участка со слоем ЗОУИТ из проекта (слой может быть выключен в легенде).
 */
export async function getZouitIntersectionsForPlotPrint(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer
): Promise<GetZouitIntersectionsForPlotPrintResult> {
  const zouitResolve = await resolveZouitVectorLayerInProject();

  if (!zouitResolve.ok) {
    return { ok: false, message: zouitResolve.message };
  }

  try {
    const wfsItems = await getWfsIntersectionsForFeature(feature, sourceLayer, zouitResolve.layer, {
      skipMaxFeaturesLimit: true
    });

    const items: IntersectionPrintItem[] = wfsItems.map(item => ({
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
