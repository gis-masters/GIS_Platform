import { currentProject } from '../../../stores/CurrentProject.store';
import { schemaTemplateService } from '../../data/schemaTemplate/schemaTemplate.service';
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
async function getSchemaTemplateLabelForMessage(schemaTemplateName: string): Promise<string> {
  try {
    const template = await schemaTemplateService.getSchemaTemplate(schemaTemplateName);
    if (template.classRule.title) {
      return template.classRule.title;
    }
  } catch {
    // fallback на schemaName ниже
  }

  return schemaTemplateName;
}

export type ResolveSingleLayerBySchemaResult = { ok: true; layer: CrgVectorLayer } | { ok: false; message: string };

/**
 * Единственный векторный слой проекта по схеме (Schema.name === schemaName).
 */
export async function resolveSingleLayerBySchemaTemplate(
  schemaTemplateName: string
): Promise<ResolveSingleLayerBySchemaResult> {
  const schemaLabel = await getSchemaTemplateLabelForMessage(schemaTemplateName);
  const matchedLayers = await resolveLayersBySchema(schemaTemplateName);

  if (!matchedLayers.length) {
    return {
      ok: false,
      message: `В проекте нет слоя по схеме "${schemaLabel}". Добавьте слой в проект.`
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
