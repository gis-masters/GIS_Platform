import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { getWfsIntersectionsForFeature } from '../../geoserver/wfs/wfs.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { type IntersectionPrintItem } from '../report.models';
import { resolveFunctionalZonesVectorLayerInProject } from './resolveFunctionalZonesVectorLayerInProject';

export type GetFunctionalZonesIntersectionsForPlotPrintResult =
  | { ok: true; items: IntersectionPrintItem[] }
  | { ok: false; message: string };

/**
 * Пересечения объекта участка со слоем функциональных зон из проекта (слой может быть выключен в легенде).
 */
export async function getFunctionalZonesIntersectionsForPlotPrint(
  feature: WfsFeature,
  sourceLayer: CrgVectorLayer
): Promise<GetFunctionalZonesIntersectionsForPlotPrintResult> {
  const fzResolve = resolveFunctionalZonesVectorLayerInProject();

  if (!fzResolve.ok) {
    return { ok: false, message: fzResolve.message };
  }

  try {
    const wfsItems = await getWfsIntersectionsForFeature(feature, sourceLayer, fzResolve.layer, {
      skipMaxFeaturesLimit: true
    });

    const items: IntersectionPrintItem[] = wfsItems.map(item => ({
      layer: fzResolve.layer,
      type: item.geometryType,
      feature: item.feature,
      intersectionArea: item.intersectionArea,
      intersectionAreaPercent: item.intersectionAreaPercent
    }));

    return { ok: true, items };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ошибка при получении пересечений со слоем функциональных зон';

    return { ok: false, message };
  }
}
