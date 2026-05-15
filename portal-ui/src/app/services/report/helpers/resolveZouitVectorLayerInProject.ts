import { currentProject } from '../../../stores/CurrentProject.store';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';

export const ZOUIT_LAYER_TITLE = 'Зоны с особыми условиями использования территорий';

export type ResolveZouitVectorLayerResult = { ok: true; layer: CrgVectorLayer } | { ok: false; message: string };

/**
 * Слой ЗОУИТ в составе проекта (видимость на карте не важна).
 */
export function resolveZouitVectorLayerInProject(): ResolveZouitVectorLayerResult {
  const candidates = currentProject.vectorLayers.filter(l => l.title === ZOUIT_LAYER_TITLE);

  if (!candidates.length) {
    return {
      ok: false,
      message: `В проекте нет слоя "${ZOUIT_LAYER_TITLE}". Добавьте слой в проект.`
    };
  }

  if (candidates.length > 1) {
    return {
      ok: false,
      message: `В проекте несколько слоев "${ZOUIT_LAYER_TITLE}". Оставьте один слой с таким названием.`
    };
  }

  const layer = candidates[0];

  if (!layer.complexName) {
    return {
      ok: false,
      message: `У слоя "${ZOUIT_LAYER_TITLE}" (id ${layer.id}) не задан complexName.`
    };
  }

  return { ok: true, layer };
}
