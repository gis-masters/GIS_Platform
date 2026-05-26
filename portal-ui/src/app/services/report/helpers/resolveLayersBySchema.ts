import { currentProject } from '../../../stores/CurrentProject.store';
import { schemaService } from '../../data/schema/schema.service';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { isVectorLayer } from '../../gis/layers/layers.typeguards';

/**
 * Векторные слои проекта, таблицы которых соответствуют схеме (Schema.name === schemaName).
 */
export async function resolveLayersBySchema(schemaName: string): Promise<CrgVectorLayer[]> {
  const matched: CrgVectorLayer[] = [];

  for (const layer of currentProject.vectorLayers) {
    if (!isVectorLayer(layer)) {
      continue;
    }

    if (!layer.dataset || !layer.resourceId) {
      continue;
    }

    try {
      const schema = await getLayerSchema(layer);
      if (schema?.name === schemaName) {
        matched.push(layer);
      }
    } catch {
      continue;
    }
  }

  return matched;
}

/** Человекочитаемое имя схемы для сообщений: title, при недоступности — Schema.name. */
export async function getSchemaLabelForMessage(schemaName: string): Promise<string> {
  try {
    const schema = await schemaService.getSchema(schemaName);
    if (schema.title) {
      return schema.title;
    }
  } catch {
    // fallback на schemaName ниже
  }

  return schemaName;
}

export type ResolveSingleLayerBySchemaResult = { ok: true; layer: CrgVectorLayer } | { ok: false; message: string };

/**
 * Единственный векторный слой проекта по схеме (Schema.name === schemaName).
 */
export async function resolveSingleLayerBySchema(schemaName: string): Promise<ResolveSingleLayerBySchemaResult> {
  const schemaLabel = await getSchemaLabelForMessage(schemaName);
  const matchedLayers = await resolveLayersBySchema(schemaName);

  if (!matchedLayers.length) {
    return {
      ok: false,
      message: `В проекте нет векторного слоя по схеме "${schemaLabel}". Добавьте слой в проект.`
    };
  }

  if (matchedLayers.length > 1) {
    return {
      ok: false,
      message: `В проекте несколько слоев по схеме "${schemaLabel}". Оставьте один такой слой в проекте.`
    };
  }

  const layer = matchedLayers[0];

  if (!layer.complexName) {
    return {
      ok: false,
      message: `У слоя по схеме "${schemaLabel}" (id ${layer.id}) не задан complexName.`
    };
  }

  return { ok: true, layer };
}
