import { currentProject } from '../../../stores/CurrentProject.store';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';

export const FUNCTIONAL_ZONES_LAYER_TITLE = 'Функциональные зоны';

export type ResolveFunctionalZonesVectorLayerResult =
  | { ok: true; layer: CrgVectorLayer }
  | { ok: false; message: string };

/**
 * Слой функциональных зон в составе проекта (видимость на карте не важна).
 */
export function resolveFunctionalZonesVectorLayerInProject(): ResolveFunctionalZonesVectorLayerResult {
  const candidates = currentProject.vectorLayers.filter(l => l.title === FUNCTIONAL_ZONES_LAYER_TITLE);

  if (!candidates.length) {
    return {
      ok: false,
      message: `В проекте нет слоя "${FUNCTIONAL_ZONES_LAYER_TITLE}". Добавьте слой в проект.`
    };
  }

  if (candidates.length > 1) {
    return {
      ok: false,
      message: `В проекте несколько слоев "${FUNCTIONAL_ZONES_LAYER_TITLE}". Оставьте один слой с таким названием.`
    };
  }

  const layer = candidates[0];

  if (!layer.complexName) {
    return {
      ok: false,
      message: `У слоя "${FUNCTIONAL_ZONES_LAYER_TITLE}" (id ${layer.id}) не задан complexName.`
    };
  }

  return { ok: true, layer };
}
